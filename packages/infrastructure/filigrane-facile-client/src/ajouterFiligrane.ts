import { get, getBlob, post } from '@potentiel-libraries/http-client';

const ApiUrl = 'https://api.filigrane.beta.gouv.fr/api/document';

const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const postDocument = async (textFiligrane: string, document: Blob): Promise<string> => {
  try {
    const form = new FormData();

    form.append('watermark', textFiligrane);
    form.append('files', document);

    const url = new URL(`${ApiUrl}/files`);

    const response = await post<{ token: string }>(url, form);
    return response.token;
  } catch (error) {
    throw new Error(`❌ Error while post document : ${(error as Error).message}`);
  }
};

const verifyDocument = async (token: string) => {
  try {
    const checkUrl = new URL(`${ApiUrl}/url/${token}`);
    await get<{ url: string }>(checkUrl);
  } catch (error) {
    throw new Error(`❌ Error while getting document exists : ${(error as Error).message}`);
  }
};

const getDocument = async (token: string) => {
  try {
    const documentUrl = new URL(`${ApiUrl}/${token}`);
    const fileResponse = await getBlob(documentUrl);

    return fileResponse;
  } catch (error) {
    throw new Error(`❌ Error while getting document : ${(error as Error).message}`);
  }
};

export const ajouterFiligrane = async (
  document: Blob,
  textFiligrane: string,
): Promise<ReadableStream> => {
  const token = await postDocument(textFiligrane, document);

  // Wait 10 seconds for the document to be processed
  await sleep(10000);

  await verifyDocument(token);

  const documentWithFiligrane = await getDocument(token);

  return documentWithFiligrane.stream();
};
