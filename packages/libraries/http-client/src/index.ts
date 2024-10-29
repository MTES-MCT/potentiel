import { ExponentialBackoff, handleAll, retry } from 'cockatiel';

const retryPolicy = retry(handleAll, {
  maxAttempts: 3,
  backoff: new ExponentialBackoff(),
});

export const get = async <T>(url: URL, signal?: AbortSignal): Promise<T> => {
  return await retryPolicy.execute(async () => {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status} ${response.statusText}`);
    }

    return await response.json();
  });
};

export const getBlob = async (url: URL, signal?: AbortSignal): Promise<Blob> => {
  return await retryPolicy.execute(async () => {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status} ${response.statusText}`);
    }

    return await response.blob();
  });
};

export const post = async <T>(
  url: URL,
  body: RequestInit['body'],
  signal?: AbortSignal,
): Promise<T> =>
  retryPolicy.execute(async () => {
    const response = await fetch(url, { signal, method: 'post', body });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status} ${response.statusText}`);
    }

    return await response.json();
  });
