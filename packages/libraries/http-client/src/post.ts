import { retryPolicy } from './retryPolicy';
import { RequestError } from './requestError';

export type Body = Record<string, string | Blob>;

export const post = async (url: URL, body: Body): Promise<JSON> => {
  const formData = new FormData();

  for (const key in body) {
    formData.append(key, body[key]);
  }

  return retryPolicy().execute(async () => {
    const response = await fetch(url, { method: 'post', body: formData });

    if (!response.ok) {
      const { status, statusText } = response;
      throw new RequestError({ status, statusText, url, method: 'POST', body });
    }

    return response.json();
  });
};
