local numOfPlayers = tonumber(redis.call('zscore', 'tables', ARGV[1]))
if numOfPlayers == 5 then
  return "Error: that table is full."
elseif numOfPlayers == nil then
  return "Error: that table doesn't exist."
elseif numOfPlayers == 0 then
  redis.call('zadd', KEYS[1]..':players', 1, ARGV[2])
  redis.call('zincrby', 'tables', 1, ARGV[1])
  -- return redis.call('zrange', KEYS[1]..':players', 0, -1, 'WITHSCORES')
else
  for i = 1, 5 do
    local player = redis.call('zrangebyscore', KEYS[1]..':players', i, i)
    if  table.getn(player) == 0 then
      redis.call('zadd', KEYS[1]..':players', i, ARGV[2])
      redis.call('zincrby', 'tables', 1, ARGV[1])
      break
      -- return redis.call('zrange', KEYS[1]..':players', 0, -1, 'WITHSCORES')
    end
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

return gamestate

--[[
  KEYS
    [1] the table we're joining

  ARGV
    [1] the table we're joining
    [2] the user
]]--
