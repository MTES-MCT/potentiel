import { ExponentialBackoff, handleAll, retry } from 'cockatiel';

const retryPolicy = retry(handleAll, {
  maxAttempts: 3,
  backoff: new ExponentialBackoff(),
});

export const get = async (url: URL, signal?: AbortSignal): Promise<unknown> => {
  return await retryPolicy.execute(async () => {
    console.log(url);
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    return await response.json();
  });
};
