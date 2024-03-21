export const right = Symbol('right');

export type Right<TValue> = {
  type: typeof right;
  value: TValue;
};
