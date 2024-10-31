import { getLogger } from '@potentiel-libraries/monitoring';
import { get, getReadableStream, post } from '@potentiel-libraries/http-client';

export const apiUrl = process.env.FILIGRANE_FACILE_ENDPOINT;

const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const envoyerDocument = async (textFiligrane: string, document: Blob) => {
  try {
    const form = new FormData();

    form.append('watermark', textFiligrane);
    form.append('files', document);

    const url = new URL(`${apiUrl}/files`);

    const response = await post<{ token: string }>(url, form);
    return response.token;
  } catch (error) {
    getLogger().error(
      new Error('@potentiel-infrastructure/filigrane-facile-client | Error while envoyerDocument'),
      { error: (error as Error).message },
    );
    return undefined;
  }
};

const récupérerDocumentAvecFiligrane = async (token: string) => {
  try {
    const vérificationUrl = new URL(`${apiUrl}/url/${token}`);
    await get<{ url: string }>(vérificationUrl);

    const récupérerDocumentAvecFiligraneUrl = new URL(`${apiUrl}/${token}`);
    return getReadableStream(récupérerDocumentAvecFiligraneUrl);
  } catch (error) {
    getLogger().error(
      new Error(
        '@potentiel-infrastructure/filigrane-facile-client | Error while récupérerDocumentAvecFiligrane',
      ),
      { error: (error as Error).message },
    );
    return undefined;
  }
};

export const ajouterFiligraneAuDocument = async (document: Blob, textFiligrane: string) => {
  if (!apiUrl) {
    getLogger().error(
      new Error(
        '@potentiel-infrastructure/filigrane-facile-client | Error while ajouterFiligraneAuDocument',
      ),
      { error: 'Missing FILIGRANE_FACILE_ENDPOINT env variable' },
    );
    return;
  }

  const token = await envoyerDocument(textFiligrane, document);

  if (!token) {
    return undefined;
  }

  // Wait 10 seconds for the document to be processed
  await sleep(10000);

  return récupérerDocumentAvecFiligrane(token);
};
