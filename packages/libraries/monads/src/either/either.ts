import { Left } from './left.js';
import { Right } from './right.js';

export type Either<TError extends Error, TValue> = Left<TError> | Right<TValue>;
