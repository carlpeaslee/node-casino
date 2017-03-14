redis.call('flushall')


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
