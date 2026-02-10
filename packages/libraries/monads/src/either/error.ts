import { Either } from './either.js';
import { left } from './left.js';

export const error = <TError extends Error, TValue>(error: TError): Either<TError, TValue> => {
  return {
    type: left,
    error,
  };
};
