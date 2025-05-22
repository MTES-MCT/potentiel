import { EmptyArrayCondition } from '../whereOptions';

export const isEmptyArray = (): EmptyArrayCondition => {
  return {
    operator: 'emptyArray',
  };
};
