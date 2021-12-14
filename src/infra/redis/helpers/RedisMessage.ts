export type RedisMessage = {
  type: string
  payload: { [key: string]: any }
  occurredAt: number
}
