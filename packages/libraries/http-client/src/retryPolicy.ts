import { retry, handleAll, ExponentialBackoff } from 'cockatiel';

export const retryPolicy = retry(handleAll, {
  maxAttempts: 3,
  backoff: new ExponentialBackoff(),
});
