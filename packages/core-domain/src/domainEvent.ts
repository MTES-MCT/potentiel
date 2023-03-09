export type DomainEvent<TPayload extends Record<string, unknown> = {}> = {
  type: string;
  createdAt: string;
  payload: TPayload;
};
