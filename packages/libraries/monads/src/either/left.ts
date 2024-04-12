export const left = Symbol('left');

export type Left<TError extends Error> = {
  type: typeof left;
  error: TError;
};
