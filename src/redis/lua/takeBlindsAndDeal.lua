for i = 1, 52 do
  redis.call('lpush', KEYS[1]..':deck', ARGV[i])
end
local min = redis.call('hget', KEYS[1], 'min')
local smallBlind = redis.call('hincrby', KEYS[1], 'smallBlind', 1)
local players = redis.call('zrange', KEYS[1]..':players', 0, 4, 'WITHSCORES')
for i = 1, table.getn(players), 2 do
  if tonumber(players[i + 1]) == smallBlind then
    redis.call('hincrby', players[i], 'wager', min / 2)
    redis.call('hset', players[i], 'state', 'SMALL')
    if (i + 1) == table.getn(players) then
      redis.call('hincrby', players[1], 'wager', min)
      redis.call('hset', players[1], 'state', 'BIG')
      smallBlind = redis.call('hincrby', KEYS[1], 'smallBlind', 1)
    else
      redis.call('hincrby', players[i + 2], 'wager', min)
      redis.call('hset', players[i + 2], 'state', 'BIG')
      smallBlind = redis.call('hincrby', KEYS[1], 'smallBlind', 1)
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
    if i < table.getn(players) then
      redis.call('hset', KEYS[1], 'activePlayer', players[i + 1])
    else
      redis.call('hset', KEYS[1], 'activePlayer', players[1])
    end
  end
end


return redis.call('hgetall', KEYS[1])
--[[
KEYS
  [1] tableId

ARGV
  [1-52] deck
]]--
