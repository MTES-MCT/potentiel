export type RedisEvent<
  TType extends string = string,
  TPayload extends Record<string, unknown> = {},
> = {
  type: TType;
  payload: TPayload;
};

export type RedisEventHandler<TEvent extends RedisEvent = RedisEvent> = (
  event: TEvent,
) => Promise<void>;
