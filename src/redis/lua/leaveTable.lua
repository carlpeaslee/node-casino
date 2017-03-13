redis.call('zrem', KEYS[1] .. ':players', ARGV[1])
redis.call('zincrby', 'tables', -1, ARGV[2])

--[[
KEYS
  [1] tableId

ARGV
  [1] playerId
  [2] tableId

]]--
