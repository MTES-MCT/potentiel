import { getLogger } from '@potentiel-libraries/monitoring';
import { get, getReadableStream, post } from '@potentiel-libraries/http-client';

const ApiUrl = 'https://api.filigrane.beta.gouv.fr/api/document';

const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const envoyerDocument = async (textFiligrane: string, document: Blob): Promise<string> => {
  try {
    const form = new FormData();

    form.append('watermark', textFiligrane);
    form.append('files', document);

    const url = new URL(`${ApiUrl}/files`);

    const response = await post<{ token: string }>(url, form);
    return response.token;
  } catch (error) {
    getLogger().warn(
      '@potentiel-infrastructure/filigrane-facile-client | Error while envoyerDocument',
      { error: (error as Error).message },
    );
    throw new Error(`❌ Error while post document : ${(error as Error).message}`);
  }
};

const vérifierDocument = async (token: string) => {
  try {
    const checkUrl = new URL(`${ApiUrl}/url/${token}`);
    await get<{ url: string }>(checkUrl);
  } catch (error) {
    getLogger().warn(
      '@potentiel-infrastructure/filigrane-facile-client | Error while vérifierDocument',
      { error: (error as Error).message },
    );
    throw new Error(`❌ Error while getting document exists : ${(error as Error).message}`);
  }
};

const récupérerDocument = async (token: string) => {
  try {
    const documentUrl = new URL(`${ApiUrl}/${token}`);
    return getReadableStream(documentUrl);
  } catch (error) {
    getLogger().warn(
      '@potentiel-infrastructure/filigrane-facile-client | Error while récupérerDocument',
      { error: (error as Error).message },
    );
    throw new Error(`❌ Error while getting document : ${(error as Error).message}`);
  }
};

export const ajouterFiligrane = async (document: Blob, textFiligrane: string) => {
  const token = await envoyerDocument(textFiligrane, document);

  // Wait 10 seconds for the document to be processed
  await sleep(10000);

  await vérifierDocument(token);

  return récupérerDocument(token);
};
