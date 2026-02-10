import { None, none } from './none.js';
import { Option } from './option.js';

export const map = <T>(value: T | undefined | null | None): Option<T> => {
  if (value === undefined || value === null || value === none) {
    return none;
  }
  return value;
};
