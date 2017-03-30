--[[

  tablesId -- (integer)
    (used to generate new tableIds)

  tables -- (sorted set)
    value -- tableId
    rank -- number of players

  table:{id} -- (hash)
    state: (string) ['waiting', 'preflop', 'flop', 'turn', 'river']
    min: the table minimum (integer)
    smallBlind: the table position of the small blind (integer)
    activePlayer: the current active player (string)
    timer: timestamp of the last action

  table:{id}:players -- (sorted set)
    value -- playerId
    rank -- position at table

  table:{id}:deck -- (list)
    each integer reflecting a card's index

  table:{id}:cards -- (list)
    each integer reflecting a card's index

  {playerId} -- (hash)
    bet -- the player's current bet (integer)
    state -- the players current state (string) ['fold', 'active']

  {playerId}:cards -- (list)
    each integer reflecting a card's index

]]--

redis.replicate_commands()

local tableId = KEYS[1]
local requestingPlayer = KEYS[2]
local action = ARGV[1]

local suits = {'c', 'd', 'h', 's'}
local values = {'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'}

local begin = function ()
  --add 0-51 to the shuffler set
  for i = 1, table.getn(suits) do
    for x = 1, table.getn(values) do
      redis.call('sadd', 'shuffler', values[x]..suits[i])
    end
  end
  --randomly remove each element from the set and adds it to the tables deck
  for i = 1, 52 do
    local card = redis.call('spop', 'shuffler')
    redis.call('lpush', tableId..':deck', card)
  end
end

local deal = function (recipient)
  local card = redis.call('lpop', tableId..':deck')
  redis.call('lpush', recipient..':cards', card)
end

local burn = function ()
  redis.call('lpop', tableId..':deck')
end



local flop = function ()
  burn()
  for i = 1, 3 do
    deal(tableId)
  end
end

local turn = function ()
  burn()
  deal(tableId)
end

local river = function ()
  burn()
  deal(tableId)
end


--returns the button's position
local button = function()
  local button = redis.call('hget', tableId, 'button')
  if button == false then
    redis.call('hset', tableId, 'button', 5)
    button = redis.call('hget', tableId, 'button')
  end
  button = tonumber(button)
  return button
end

local playerState = function (player, newState)
  if newState ~= nil then
    redis.call('hset', player, 'state', newState)
  end
  return redis.call('hget', player, 'state')
end

local bet = function (player, wager)
  if wager ~= nil then
    redis.call('hincrbyfloat', player, 'bet', wager)
  end
  local bet = redis.call('hincrby', player, 'bet', 0)
  return tonumber(bet)
end

-- get/setter which can set the tables the state and will return the table's state
local state = function (newState)
  if newState ~= nil and type(newState) == 'string' then
    redis.call('hset', tableId, 'state', newState)
  end
  return redis.call('hget', tableId, 'state')
end

local cards = function (playerOrTable)
  return redis.call('lrange', tableId, playerOrTable..':cards', 0, -1)
end

--returns the table minimum
local minimum = function ()
  return redis.call('hget', tableId, 'minimum')
end

local numberOfPlayers = function()
  local result = redis.call('zscore', 'tables', tableId)
  return tonumber(result)
end

--returns all players at the table in order of position
local players =  function ()
  return redis.call('zrangebyscore', tableId..':players', 1, 5)
end




local pot = function ()
  local players = players()
  local pot = 0
  for i = 1, table.getn(players) do
    local bet = bet(players[i])
    bet = tonumber(bet)
    pot = pot + bet
  end
  return pot
end

local bigBet = function ()
  local players = players()
  local wagers = {}
  for i = 1, table.getn(players) do
    local bet = bet(players[i])
    bet = tonumber(bet)
    table.insert(wagers, bet)
  end
  return math.max(unpack(wagers))
end

--returns the playerId of the in turn player
local inTurnPlayer = function ()
  return redis.call('hget', tableId, 'inTurn')
end

local setTimer = function ()
  local now = redis.call('time')
  redis.call('hset', tableId, 'timer', now[1])
end

local timer = function()
  local value = redis.call('hget', tableId, 'timer')
  if value == false then
    return value
  else
    value = tonumber(value)
    local now = redis.call('time')
    now = tonumber(now[1])
    return now - value
  end
end

--returns all activePlayers in order of turn, starting with the person to the left of the button
local activePlayers = function ()
  local cursor = button()
  cursor = cursor + 1
  local activePlayers = {}
  for i = 1, 5 do
    if cursor > 5 then cursor = 1 end
    local player = redis.call('zrangebyscore', tableId..':players', cursor, cursor)
    if table.getn(player) == 1 then
      player = player[1]
      local playerState = redis.call('hget', player, 'state')
      if playerState ~= 'fold' and playerState ~= nil then
        table.insert(activePlayers, player)
      end
    end
    cursor = cursor + 1
  end
  return activePlayers
end

local dealAll = function ()
  begin()
  local tablePlayers = activePlayers()
  for x = 1, 2 do
    for i = 1, table.getn(tablePlayers) do
      deal(tablePlayers[i])
      if x == 2 then
        playerState(tablePlayers[i], 'active')
      end
    end
  end
end

--returns the next active player after the current in turn player or false
local nextInTurnPlayer = function ()
  local activePlayer = inTurnPlayer()
  local cursor = redis.call('zscore', tableId..':players', activePlayer)
  local nextPlayer = false
  local bigBet = bigBet()
  for i = 1, 5 do
    cursor = cursor + 1
    if cursor > 5 then cursor = 1 end
    local player = redis.call('zrangebyscore', tableId..':players', cursor, cursor)
    if table.getn(player) == 1 then
      player = player[1]
      local state = playerState(player)
      local bet = bet(player)
      if state == 'active' then
        nextPlayer = player
        break
      end
      if state == 'check' and bet < bigBet then
        nextPlayer = player
        break
      end

    end
  end
  return nextPlayer
end

local setInTurnPlayer = function (player)
  redis.call('hset', tableId, 'inTurn', player)
  setTimer()
end

local resetActivePlayerStates = function()
  local activePlayers = activePlayers()
  for i = 1, table.getn(activePlayers) do
    playerState(activePlayers[i],'active')
  end
end

local advanceState = function ()
  local currentState = state()
  if currentState == 'waiting' then
    state('preflop')
  elseif currentState == 'preflop' then
    state('flop')
    flop()
  elseif currentState == 'flop' then
    state('turn')
    river()
  elseif currentState == 'turn' then
    state('river')
    turn()
  elseif currentState == 'river' then
    state('showdown')
  elseif currentState == 'showdown' then
    state('waiting')
  end
  if state() ~= 'preflop' then
    resetActivePlayerStates()
    local activePlayers = activePlayers()
    setInTurnPlayer(activePlayers[1])
  end
end



local nextPlayer = function ()
  local nextInTurnPlayer = nextInTurnPlayer()
  if nextInTurnPlayer ~= false then
    setInTurnPlayer(nextInTurnPlayer)
  else
    advanceState()
  end
end

local takeBlinds = function ()
  local activePlayers = activePlayers()
  local bigBlinds = minimum()
  local smallBlinds = bigBlinds / 2
  bet(activePlayers[2], smallBlinds )
  playerState(activePlayers[2], 'active')
  if activePlayers[3] ~= nil then
    bet(activePlayers[3], bigBlinds)
    playerState(activePlayers[3], 'active')
    if activePlayers[4] ~= nil then
      setInTurnPlayer(activePlayers[4])
    else
      setInTurnPlayer(activePlayer[1])
    end
  else
    bet(activePlayers[1], bigBlinds)
    playerState(activePlayers[1], 'active')
    setInTurnPlayer(activePlayers[2])
  end
end

local cleanup = function ()
  local players = players()
  for i = 1, table.getn(players) do
    redis.call('del', players[i]..':cards', 0, 0)
    redis.call('hset', players[i], 'bet', 0)
    redis.call('hset', players[i], 'state', 'active')
  end
  redis.call('del', tableId..':cards', 0, 0)
  redis.call('del', tableId..':deck', 0, 0)
end

local basicUpdateObject = function ()
  local updateObject = redis.call('hgetall', tableId)

  table.insert(updateObject, 'numberOfPlayers')
  table.insert(updateObject, numberOfPlayers())

  local playerHand = redis.call('lrange', requestingPlayer..':cards', 0 , -1)

  table.insert(updateObject, 'cards')
  table.insert(updateObject, playerHand)

  local tableCards = redis.call('lrange', tableId..':cards', 0, -1)
  table.insert(updateObject, 'table')
  table.insert(updateObject, tableCards)

  return updateObject
end

local individualUpdateObject = function ()
  local object = basicUpdateObject()
  local players = redis.call('zrange', tableId..':players', 0, 4, 'WITHSCORES')

  local occupiedSeats = {}

  for k, v in pairs(players) do
    if k % 2 == 1 then
      table.insert(object, players[k + 1])
      table.insert(occupiedSeats, players[k+1])
      local player = redis.call('hgetall', v)
      table.insert(player, 'player')
      table.insert(player, v)
      table.insert(object, player)
    end
  end

  table.insert(object, 'occupiedSeats')
  table.insert(object, occupiedSeats)


  return object
end

local showdownObject = function()
  local object = basicUpdateObject()
  local activePlayers = activePlayers()
  local players = redis.call('zrange', tableId..':players', 0, 4, 'WITHSCORES')

  local occupiedSeats = {}

  for k, v in pairs(players) do
    if k % 2 == 1 then
      table.insert(object, players[k + 1])
      table.insert(occupiedSeats, players[k+1])
      local player = redis.call('hgetall', v)
      table.insert(player, 'player')
      table.insert(player, v)
      local cards = redis.call('lrange', v..':cards', 0, -1)
      table.insert(player, 'cards')
      table.insert(player, cards)
      table.insert(object, player)
    end
  end

  table.insert(object, 'occupiedSeats')
  table.insert(object, occupiedSeats)


  table.insert(object, 'showdown')
  table.insert(object, true)

  return object

end

local winnerObject = function()
  local object = individualUpdateObject()
  local activePlayers = activePlayers()
  table.insert(object, "winner")
  table.insert(object, activePlayers[1])

  return object
end


-- start the game if it can be started
if state() == 'waiting' and numberOfPlayers() < 1 then

elseif state() == 'waiting' and numberOfPlayers() > 1 then
  if timer() == false then
    setTimer()
  elseif timer() > 2 then
    cleanup()
    dealAll()
    takeBlinds()
    advanceState()
  end
else

  --check to make sure the timer hasnt expired
  if timer() ~= false and timer() > 30 and state() ~= 'showdown' then
    playerState(inTurnPlayer(), 'fold')
    nextPlayer()
  end


  if action ~= 'none' and requestingPlayer == inTurnPlayer() then
    if action == 'fold' then
      playerState(requestingPlayer,'fold')
      nextPlayer()
    else
      action = tonumber(action)
      if action + bet(requestingPlayer) >= bigBet() then
        bet(requestingPlayer, action)
        playerState(requestingPlayer,'check')
        nextPlayer()
      end
    end
  end

  if table.getn(activePlayers()) < 2 and pot() > 0 and state() ~= 'waiting' then
    state('waiting')
    return winnerObject()
  end

  if state() == 'showdown' then
    state('waiting')
    return showdownObject()
  end

end

return individualUpdateObject()
