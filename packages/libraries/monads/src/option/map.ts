import { type None, none } from './none';
import type { Option } from './option';

export const map = <T>(value: T | undefined | null | None): Option<T> => {
  if (value === undefined || value === null || value === none) {
    return none;
  }
  return value;
};
