import { EmptyArrayCondition } from '../whereOptions.js';

export const isEmptyArray = (): EmptyArrayCondition => {
  return {
    operator: 'emptyArray',
  };
};
