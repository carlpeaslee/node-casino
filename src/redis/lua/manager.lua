--[[

  tablesId -- (integer)
    (used to generate new tableIds)

  tables -- (sorted set)
    value -- tableId
    rank -- number of players

  table:{id} -- (hash)
    gamestate: (string)
    min: the table minimum (integer)
    smallBlind: the table position of the small blind (integer)
    activePlayer: the current active player (string)
    timer: timestamp of the last action

  table:{id}:players -- (sorted set)
    value -- playerId
    rank -- position at table

  table:{id}:deck -- (list)
    each integer reflecting a card's index

  {playerId} -- (hash)
    wager -- the player's current wager (integer)
    state -- the players current state

  {playerId}:hand -- (list)
    each integer reflecting a card's index

]]--


redis.replicate_commands()

local playersAtTable = redis.call('zscore', 'tables', KEYS[1])
local tableStatus = redis.call('hget', KEYS[1], 'gamestate')

if tableStatus == 'WAITING' and tonumber(playersAtTable) > 1 then
  --put 0-51 in a temporary set
  for i = 0, 51 do
    redis.call('sadd', 'shuffler', i)
  end
  --randomly remove each element from the set
  for i = 0, 51 do
    local card = redis.call('spop', 'shuffler')
    redis.call('lpush', KEYS[1]..':deck', card)
  end

  local min = redis.call('hget', KEYS[1], 'min')
  local smallBlind = redis.call('hincrby', KEYS[1], 'smallBlind', 1)
  local players = redis.call('zrange', KEYS[1]..':players', 0, 4, 'WITHSCORES')
  for i = 1, table.getn(players), 2 do
    if tonumber(players[i + 1]) == smallBlind then
      redis.call('hincrby', players[i], 'wager', (min / 2))
      redis.call('hset', players[i], 'state', 'SMALL')
      if (i + 1) == table.getn(players) then
        redis.call('hincrby', players[1], 'wager', min)
        redis.call('hset', players[1], 'state', 'BIG')
        smallBlind = redis.call('hincrby', KEYS[1], 'smallBlind', 1)
        break
      else
        redis.call('hincrby', players[i + 2], 'wager', min)
        redis.call('hset', players[i + 2], 'state', 'BIG')
        smallBlind = redis.call('hincrby', KEYS[1], 'smallBlind', 1)
        break
      end
    else
      smallBlind = redis.call('hincrby', KEYS[1], 'smallBlind', 1)
    end
  end
  players = redis.call('zrange', KEYS[1]..':players', 0, 4)
  for i = 1, 2 do
    for x = 1, table.getn(players) do
      local card = redis.call('lpop', KEYS[1]..':deck')
      redis.call('lpush', players[x]..':hand', card)
    end
  end

  redis.call('hset', KEYS[1], 'gamestate', 'ANTE')

  for i = 1, table.getn(players) do
    if  redis.call('hget', players[i], 'state') == 'BIG' then
      if i == table.getn(players) then
        redis.call('hset', KEYS[1], 'activePlayer', players[1])
        local time = redis.call('time')
        redis.call('hset', KEYS[1], 'timer', time[1])
      else
        redis.call('hset', KEYS[1], 'activePlayer', players[i + 1])
        local time = redis.call('time')
        redis.call('hset', KEYS[1], 'timer', time[1])
      end
    end
  end

end

local lastAction = tonumber(redis.call('hget', KEYS[1], 'timer'))
if lastAction then
  local now = redis.call('time')
  now = tonumber(now[1])

  local difference = now - lastAction

  if difference < 10 then

  else
    local activePlayer = redis.call('hget', KEYS[1],'activePlayer')
    local players = redis.call('zrangebyscore', KEYS[1]..':players', 1, 5)

    redis.call('hset', activePlayer, 'state', 'FOLD')

    local numberOfPlayers = table.getn(players)

    local activeIndex
    for k, v in pairs(players) do
      if v == activePlayer then
        activeIndex = k
        if activeIndex == numberOfPlayers then
          activeIndex = 1
        else
          activeIndex = activeIndex + 1
        end
      end
    end

    redis.call('hset', KEYS[1], 'activePlayer', players[activeIndex])
    local time = redis.call('time')
    redis.call('hset', KEYS[1], 'timer', time[1])

  end
end

local gamestate = redis.call('hget', KEYS[1], 'gamestate')

local players = redis.call('zrangebyscore', KEYS[1]..':players', 1, 5)

local roundOver = false

local wagers = {}

table.insert(wagers, tonumber(redis.call('hget', KEYS[1], 'min')))

for i = 1, table.getn(players) do
  local wager = redis.call('hget', players[i], 'wager')
  if wager == nil then
    wager = 0
  end
  table.insert(wagers, tonumber(wager))
end


local highbet = math.max(unpack(wagers))

if gamestate == 'ante' then
  for i = 1, table.getn(players) do
    local playerstate = redis.call('hget', players[i], 'state')
    local playerbet = redis.call('hget', players[i], 'wager')
    if playerstate == 'fold' or playerbet == highbet then
      roundOver = true
    else
      roundOver = false
    end
  end

  if roundOver == true then
    for i = 1, 3 do
      local burn = redis.call('lpop', KEYS[1]..':deck')
      local dealCard = redis.call('lpop', KEYS[1]..':deck')
      redis.call('lpush', KEYS[1]..':table', dealCard)
    end

    local smallBlind = redis.call('hget', KEYS[1], 'smallBlind')
    local player = redis.call('zrange', smallBlind, smallBlind)
    player = player[1]

    redis.call('hset', 'activePlayer', player)
    redis.call('hset', 'gamestate', 'flop')

  end

end








local gamestate = redis.call('hgetall', KEYS[1])

local players = redis.call('zrange', KEYS[1]..':players', 0, 4, 'WITHSCORES')

for k, v in pairs(players) do
  if k % 2 == 1 then
    table.insert(gamestate, players[k + 1])
    local player = redis.call('hgetall', v)
    table.insert(player, 'player')
    table.insert(player, v)
    table.insert(gamestate, player)
  end
end

table.insert(gamestate, 'players')
table.insert(gamestate, redis.call('zscore','tables', KEYS[1]))

local playerHand = redis.call('lrange', KEYS[2]..':hand', 0 , -1)

table.insert(gamestate, 'hand')
table.insert(gamestate, playerHand)

local tableCards = redis.call('lrange', KEYS[1]..':table', 0, -1)
table.insert(gamestate, 'table')
table.insert(gamestate, tableCards)

return gamestate


--[[
KEYS
  [1] table:id
  [2] requesting player

ARGV
  [1] action

]]--
