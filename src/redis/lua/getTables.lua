local tables = redis.call('zrangebyscore', 'tables', 0, 4)
if table.getn(tables) < 1 then
  local tableId = 'table:' .. redis.call('incr', 'tablesId')
  redis.call('zadd', 'tables', 0, tableId)
end
return redis.call('zrange', 'tables', 0, 4, 'WITHSCORES')


--[[
KEYS
  [1] tables
  [2] table:ids

ARGV


]]--
