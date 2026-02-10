import { isNone } from './none.js';
import { Option } from './option.js';

export const isSome = <TValue>(value: Option<TValue>): value is TValue => !isNone(value);
