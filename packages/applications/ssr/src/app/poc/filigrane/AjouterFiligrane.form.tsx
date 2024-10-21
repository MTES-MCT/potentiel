'use client';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';

import { ajouterFiligraneAction } from './filigrane.action';

export const AjouterFiligraneForm = () => (
  <Form
    action={ajouterFiligraneAction}
    method="POST"
    encType="multipart/form-data"
    actions={<SubmitButton>Ajouter document</SubmitButton>}
  >
    <UploadDocument
      label={`Document pour lequel on doit ajouter un filigrane`}
      id="document"
      name="document"
      required={true}
    />
  </Form>
);
