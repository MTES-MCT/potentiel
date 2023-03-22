export type DomainEvent<
  TType extends string = string,
  TPayload extends Record<string, unknown> = {},
> = {
  type: TType;
  payload: TPayload;
};
