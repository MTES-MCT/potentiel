import { Either } from './either.js';
import { Right, right } from './right.js';

export const isValue = <TError extends Error, TValue>(
  either: Either<TError, TValue>,
): either is Right<TValue> => {
  return either.type === right;
};
