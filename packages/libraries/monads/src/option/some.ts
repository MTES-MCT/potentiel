import { isNone } from './none.js';
import type { Option } from './option.js';

export const isSome = <TValue>(value: Option<TValue>): value is TValue => !isNone(value);
