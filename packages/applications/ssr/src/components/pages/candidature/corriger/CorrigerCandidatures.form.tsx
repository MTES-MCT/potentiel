'use client';

import { FC, useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';

import { corrigerCandidaturesAction } from './corrigerCandidatures.action';

export const CorrigerCandidaturesForm: FC = () => {
  // const [validationErrors, setValidationErrors] = useState<Array<string>>([]);
  const [validationErrors, setValidationErrors] = useState<Array<string>>(['fichierImport']);

  console.log(validationErrors);
  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      action={corrigerCandidaturesAction}
      heading="Corriger un import de candidatures"
      pendingModal={{
        id: 'form-corriger-candidatures',
        title: 'Corriger un import de candidat(s)',
        children: 'Correction des candidats en cours...',
      }}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      successMessage={'candidats corrigés'}
      actions={<SubmitButton>Corriger</SubmitButton>}
    >
      <UploadDocument
        label="Fichier CSV"
        id="fichierImport"
        name="fichierImport"
        required
        format="csv"
        state={validationErrors.includes('fichierImport') ? 'error' : 'default'}
        stateRelatedMessage="Fichier CSV obligatoire"
      />
    </Form>
  );
};
