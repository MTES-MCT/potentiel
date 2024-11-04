import { retry, ExponentialBackoff, handleType } from 'cockatiel';

import { RequestError } from './requestError';

const handleServerErrors = handleType(RequestError, (error) => error.iServerError);

type RetryPolicyOptions = {
  handleAnotherError?: (error: RequestError) => boolean;
  maxAttempts?: number;
};

export const retryPolicy = (options: RetryPolicyOptions) => {
  const handleError = handleType(RequestError, (error) =>
    error.iServerError || options?.handleAnotherError ? options.handleAnotherError(error) : false,
  );

  return retry(handleError, {
    maxAttempts: 3,
    backoff: new ExponentialBackoff(),
  });
};
