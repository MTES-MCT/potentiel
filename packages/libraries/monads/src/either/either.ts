import { Left } from './left';
import { Right } from './right';

export type Either<TError extends Error, TValue> = Left<TError> | Right<TValue>;
