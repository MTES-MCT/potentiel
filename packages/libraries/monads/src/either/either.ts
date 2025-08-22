import type { Left } from './left';
import type { Right } from './right';

export type Either<TError extends Error, TValue> = Left<TError> | Right<TValue>;
