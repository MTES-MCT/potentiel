export type FetchOptions = {
  pathname: string;
  searchParams?: Record<string, string | number>;
  body?: Record<string, unknown>;
};
export type MailjetFetch = <T = unknown>(options: FetchOptions) => Promise<T>;

export const createMailjetFetch = ({
  baseUrl,
  apiKeyPublic,
  apiKeyPrivate,
}: {
  baseUrl: string;
  apiKeyPublic: string;
  apiKeyPrivate: string;
}): MailjetFetch => {
  return async <T = unknown>({ pathname, searchParams, body }: FetchOptions) => {
    const url = new URL(`${baseUrl}${pathname}`);
    for (const [clé, valeur] of Object.entries(searchParams ?? {})) {
      url.searchParams.set(clé, String(valeur));
    }
    const response = await fetch(url.toString(), {
      method: body ? 'POST' : 'GET',
      headers: {
        Authorization: getMailjetAuthorization(apiKeyPublic, apiKeyPrivate),
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(
        `Mailjet ${body ? 'POST' : 'GET'} ${pathname} : ${response.status} ${await response.text()}`,
      );
    }
    return response.json() as T;
  };
};

const getMailjetAuthorization = (apiKeyPublic: string, apiKeyPrivate: string) =>
  `Basic ${Buffer.from(`${apiKeyPublic}:${apiKeyPrivate}`).toString('base64')}`;
