import { retryPolicy } from './retryPolicy';
import { RequestError } from './requestError';

const getResponse = async (url: URL): Promise<Response> => {
  return retryPolicy().execute(async () => {
    const response = await fetch(url);

    if (!response.ok) {
      const { status, statusText } = response;
      throw new RequestError({ status, statusText, url, method: 'GET' });
    }

    return response;
  });
};

export const get = async <T>(url: URL): Promise<T> => (await getResponse(url)).json();

export const getBlob = async (url: URL): Promise<Blob> => (await getResponse(url)).blob();
