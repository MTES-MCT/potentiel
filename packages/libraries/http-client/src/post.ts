import { retryPolicy } from './retryPolicy';

export const post = async (url: URL, body: Record<string, string | Blob>): Promise<JSON> => {
  const formData = new FormData();

  for (const key in body) {
    formData.append(key, body[key]);
  }

  return retryPolicy.execute(async () => {
    const response = await fetch(url, { method: 'post', body: formData });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status} ${response.statusText}`);
    }

    return response.json();
  });
};
