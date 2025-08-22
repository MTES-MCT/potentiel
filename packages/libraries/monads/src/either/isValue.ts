import type { Either } from './either';
import { type Right, right } from './right';

export const isValue = <TError extends Error, TValue>(
  either: Either<TError, TValue>,
): either is Right<TValue> => {
  return either.type === right;
};
