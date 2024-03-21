import { Either } from './either';
import { right } from './right';

export const value = <TError extends Error, TValue>(value: TValue): Either<TError, TValue> => {
  return {
    type: right,
    value,
  };
};
