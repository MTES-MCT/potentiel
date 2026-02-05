import { retryPolicy, RetryPolicyOptions } from './retryPolicy.js';
import { RequestError } from './requestError.js';

export type Body = Record<string, string | Blob>;

type Post = {
  url: URL;
  body: Body;
  retryPolicyOptions?: RetryPolicyOptions;
};
export const post = async ({ body, url, retryPolicyOptions }: Post): Promise<JSON> => {
  const formData = new FormData();

  for (const key in body) {
    formData.append(key, body[key]);
  }

  return retryPolicy(retryPolicyOptions).execute(async () => {
    const response = await fetch(url, { method: 'post', body: formData });

    if (!response.ok) {
      const { status, statusText } = response;
      throw new RequestError({ status, statusText, url, method: 'POST', body });
    }

    return response.json() as Promise<JSON>;
  });
};
