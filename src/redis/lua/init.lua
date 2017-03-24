redis.call('flushall')
for i = 0, 51 do
  redis.call('sadd', 'deck', i)
end

return {
  'status', 1,
  'message', 'Redis has been succesfully initialized'
}

--[[
KEYS
  [1] tables
  [2] table:ids

ARGV


]]--
