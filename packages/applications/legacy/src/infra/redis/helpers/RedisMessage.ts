export type RedisMessage = {
  type: string;
  payload: Record<string, any>;
  occurredAt: number;
};
