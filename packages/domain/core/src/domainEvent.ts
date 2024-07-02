type PrimitiveType = number | string | boolean | { [key: string]: PrimitiveType };

export type DomainEvent<
  TType extends string = string,
  TPayload extends Record<string, PrimitiveType> = {},
> = {
  type: TType;
  payload: TPayload;
};
