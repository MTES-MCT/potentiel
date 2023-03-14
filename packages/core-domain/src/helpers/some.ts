import { isNone } from './none';
import { Option } from './option';

export const isSome = <TValue>(value: Option<TValue>): value is TValue => !isNone(value);
