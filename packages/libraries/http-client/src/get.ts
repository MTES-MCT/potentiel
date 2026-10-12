import { RequestError } from './requestError.js';
import { type RetryPolicyOptions, retryPolicy } from './retryPolicy.js';

type GetOptions = {
  url: URL;
  headers?: Record<string, string>;
  retryPolicyOptions?: RetryPolicyOptions;
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
  (await getResponse(options)).json() as Promise<T>;

export const getBlob = async (options: GetOptions): Promise<Blob> =>
  (await getResponse(options)).blob();
