import { Either } from './either.js';
import { Left, left } from './left.js';

export const isError = <TError extends Error, TValue>(
  either: Either<TError, TValue>,
): either is Left<TError> => {
  return either.type === left;
};
