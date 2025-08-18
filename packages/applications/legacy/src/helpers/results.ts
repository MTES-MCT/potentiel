import { logger } from '../core/utils';

const mapExceptError = <T, K>(arr: Array<T>, fn: (T) => K, errorMessage: string): Array<K> =>
  arr.reduce((validItems: Array<K>, item: T) => {
    try {
      validItems.push(fn(item));
    } catch (error) {
      if (errorMessage) logger.error(errorMessage);
      logger.error(error);
    }
    return validItems;
  }, []);

export { mapExceptError };
