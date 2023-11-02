/**
 * @deprecated en faveur de l'implémentation dans le package @pontentiel-domain/core
 */
export type DomainEvent<
  TType extends string = string,
  TPayload extends Record<string, unknown> = {},
> = {
  type: TType;
  payload: TPayload;
};
