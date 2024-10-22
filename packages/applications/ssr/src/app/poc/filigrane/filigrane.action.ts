'use server';

import * as zod from 'zod';
import axios from 'axios';

import { get } from '@potentiel-libraries/http-client';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { document } from '@/utils/zod/documentTypes';

const schema = zod.object({
  document,
});

export const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const postDocument = async (ApiUrl: string, document: Blob) => {
  try {
    const form = new FormData();
    form.append('watermark', 'POC de la startup Potentiel');
    form.append('files', document);

    const {
      data: { token },
    } = await axios.post(`${ApiUrl}/files`, form);

    return token;
  } catch (error) {
    throw new Error(`❌ Error while post document : ${(error as Error).message}`);
  }
};

const verifyDocumentExists = async (ApiUrl: string, token: string) => {
  const checkUrl = new URL(`${ApiUrl}/url/${token}`);

  const response = await get<{ url: string }>(checkUrl);

  return response.url;
};

const action: FormAction<FormState, typeof schema> = async (_, { document }) => {
  try {
    const API_URL = 'https://api.filigrane.beta.gouv.fr/api/document';

    const token = await postDocument(API_URL, document);

    // Wait 10 seconds for the document to be processed
    await sleep(10000);

    await verifyDocumentExists(API_URL, token);

    const documentUrl = `${API_URL}/${token}`;

    return {
      status: 'success',
      documentUrl,
    };
  } catch (e) {
    console.error(e);
    return {
      status: 'api-error',
      message: (e as Error).message,
    };
  }
};

export const ajouterFiligraneAction = formAction(action, schema);
