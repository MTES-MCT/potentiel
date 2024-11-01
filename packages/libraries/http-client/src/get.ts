import { retryPolicy } from './retryPolicy';

const getResponse = async (url: URL): Promise<Response> => {
  return retryPolicy.execute(async () => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status} ${response.statusText}`);
    }

    return response;
  });
};

export const get = async <T>(url: URL): Promise<T> => (await getResponse(url)).json();

export const getBlob = async (url: URL): Promise<Blob> => (await getResponse(url)).blob();
