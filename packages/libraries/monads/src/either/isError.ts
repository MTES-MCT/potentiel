import type { Either } from './either';
import { type Left, left } from './left';

export const isError = <TError extends Error, TValue>(
  either: Either<TError, TValue>,
): either is Left<TError> => {
  return either.type === left;
};
