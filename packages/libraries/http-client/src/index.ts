import { ExponentialBackoff, handleAll, retry } from 'cockatiel';

const retryPolicy = retry(handleAll, {
  maxAttempts: 3,
  backoff: new ExponentialBackoff(),
});

export const get = async <T>(url: URL, signal?: AbortSignal): Promise<T> => {
  return retryPolicy.execute(async () => {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status} ${response.statusText}`);
    }

    return response.json();
  });
};

export const getReadableStream = async (
  url: URL,
  signal?: AbortSignal,
): Promise<ReadableStream> => {
  return retryPolicy.execute(async () => {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();

    return blob.stream();
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

    return response.json();
  });
