import { createClient } from 'redis'
declare global {
  type RedisClient = ReturnType<typeof createClient>
  type RedisTuple = Exclude<Parameters<RedisClient['xAdd']>[2], string>
}
