import { Either } from './either';
import { left, Left } from './left';

export const isError = <TError extends Error, TValue>(
  either: Either<TError, TValue>,
): either is Left<TError> => {
  return either.type === left;
};
