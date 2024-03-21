import { Either } from './either';
import { left } from './left';

export const error = <TError extends Error, TValue>(error: TError): Either<TError, TValue> => {
  return {
    type: left,
    error,
  };
};
