import { Either } from './either.js';
import { right } from './right.js';

export const value = <TError extends Error, TValue>(value: TValue): Either<TError, TValue> => {
  return {
    type: right,
    value,
  };
};
