local numOfPlayers = tonumber(redis.call('zscore', 'tables', ARGV[1]))
if numOfPlayers == 5 then
  return "Error: that table is full."
elseif numOfPlayers == nil then
  return "Error: that table doesn't exist."
elseif numOfPlayers == 0 then
  redis.call('zadd', KEYS[1]..':players', 1, ARGV[2])
  redis.call('zincrby', 'tables', 1, ARGV[1])
  return redis.call('zrange', KEYS[1]..':players', 0, -1, 'WITHSCORES')
else
  for i = 1, 5 do
    local player = redis.call('zrangebyscore', KEYS[1]..':players', i, i)
    if  table.getn(player) == 0 then
      redis.call('zadd', KEYS[1]..':players', i, ARGV[2])
      redis.call('zincrby', 'tables', 1, ARGV[1])
      return redis.call('zrange', KEYS[1]..':players', 0, -1, 'WITHSCORES')
    end
  end
end

--[[
  KEYS
    [1] the table we're joining

  ARGV
    [1] the table we're joining
    [2] the user
]]--
