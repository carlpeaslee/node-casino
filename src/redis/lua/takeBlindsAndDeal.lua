redis.replicate_commands()
for i = 1, 52 do
  redis.call('lpush', KEYS[1]..':deck', ARGV[i])
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

redis.call('hset', KEYS[1], 'gamestate', 'PREFLOP')

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

local gamestate = redis.call('hgetall', KEYS[1])


players = redis.call('zrange', KEYS[1]..':players', 0, 4, 'WITHSCORES')

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

return gamestate
--[[
KEYS
  [1] tableId

ARGV
  [1-52] deck
]]--
