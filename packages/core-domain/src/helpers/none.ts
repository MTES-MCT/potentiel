export const none = {
  type: Symbol('none'),
} as const;

export type None = typeof none;

export const isNone = (value: any): value is None => {
  return value === none;
};
