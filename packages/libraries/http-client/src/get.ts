import { retryPolicy, RetryPolicyOptions } from './retryPolicy';
import { RequestError } from './requestError';

type GetOptions = {
  url: URL;
  retryPolicyOptions?: RetryPolicyOptions;
  headers?: HeadersInit;
};

const getResponse = async ({ url, headers, retryPolicyOptions }: GetOptions): Promise<Response> =>
  retryPolicy(retryPolicyOptions).execute(async () => {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const { status, statusText } = response;
      throw new RequestError({ status, statusText, url, method: 'GET' });
    }

    return response;
  });

export const get = async <T>(options: GetOptions): Promise<T> =>
  (await getResponse(options)).json();

export const getBlob = async (options: GetOptions): Promise<Blob> =>
  (await getResponse(options)).blob();
