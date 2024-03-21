export const none = Symbol('none');

export type None = typeof none;

export const isNone = (value: any): value is None => {
  return value === none;
};
