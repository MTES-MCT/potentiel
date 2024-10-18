'use server';

import * as zod from 'zod';
import axios from 'axios';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { document } from '@/utils/zod/documentTypes';

const schema = zod.object({
  document,
});

const action: FormAction<FormState, typeof schema> = async (previousState, { document }) => {
  try {
    const form = new FormData();

    const file = new File([document], 'test.pdf', { type: 'application/pdf' });

    form.append('file', file);
    form.append('watermark', 'SPECIMEN'); // Remplacez par le texte du filigrane

    const response = await axios.post(
      'https://api.filigrane.beta.gouv.fr/api/document/files',
      form,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    console.log('File uploaded successfully:', response.data);
  } catch (e) {
    console.error('Error while uploading file:', e);
  }

  return {
    status: 'success',
    redirectUrl: '#',
  };
};

export const ajouterFiligraneAction = formAction(action, schema);
