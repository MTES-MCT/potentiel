export type DomainEvent<TPayload extends Record<string, unknown> = {}> = {
  type: string;
  payload: TPayload;
};
