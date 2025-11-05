import { retryPolicy, RetryPolicyOptions } from './retryPolicy';
import { RequestError } from './requestError';

type GetOptions = {
  url: URL;
  retryPolicyOptions?: RetryPolicyOptions;
};
const getResponse = async ({ url, retryPolicyOptions }: GetOptions): Promise<Response> =>
  retryPolicy(retryPolicyOptions).execute(async () => {
    const response = await fetch(url);

    if (!response.ok) {
      const { status, statusText } = response;
      throw new RequestError({ status, statusText, url, method: 'GET' });
    }

    return response;
  });

export const get = async <T>({ url, retryPolicyOptions }: GetOptions): Promise<T> =>
  (await getResponse({ url, retryPolicyOptions })).json() as Promise<T>;

export const getBlob = async ({ url, retryPolicyOptions }: GetOptions): Promise<Blob> =>
  (await getResponse({ url, retryPolicyOptions })).blob();
