import type { Left } from './left.js';
import type { Right } from './right.js';

export type Either<TError extends Error, TValue> = Left<TError> | Right<TValue>;
