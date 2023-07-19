import { Result, Option, Err } from '@hqoss/monads';

import { logger } from '@core/utils';

// For monads
export { Ok, Err, Some, None } from '@hqoss/monads';
export type { Result, Option } from '@hqoss/monads';

const ErrorResult = <T>(error: string) => Err<T, Error>(new Error(error));

export { ErrorResult };

export type ResultAsync<T> = Promise<Result<T, Error>>;
export type OptionAsync<T> = Promise<Option<T>>;

export const UnwrapForTest = <T>(res: Result<T, Error>) => {
  if (res.isOk()) return res.unwrap();
  logger.error(res.unwrapErr());
  throw new Error('UnwrapForTest: Result is error, cannot unwrap');
};
