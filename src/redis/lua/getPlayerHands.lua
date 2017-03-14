local result = {}
local players = redis.call('zrange', KEYS[1]..':players', 0, -1)

for k, v in pairs(players) do
  table.insert(result, v)
  local cards = redis.call('lrange', v..':hand', 0, -1)
  table.insert(result, cards)
end

return result

--[[
KEYS
  [1] tableId

ARGV


]]--
