'use client';

import { FC, useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  CorrigerPlusieursCandidaturesAction,
  CorrigerPlusieursCandidaturesFormKeys,
} from './CorrigerPlusieursCandidatures.action';

export const CorrigerPlusieursCandidaturesForm: FC = () => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<CorrigerPlusieursCandidaturesFormKeys>
  >({});

  return (
    <Form
      action={CorrigerPlusieursCandidaturesAction}
      heading="Corriger un import de candidatures"
      pendingModal={{
        id: 'form-corriger-candidatures',
        title: 'Corriger un import de candidat(s)',
        children: 'Correction des candidats en cours...',
      }}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      successMessage={'candidat(s) corrigé(s)'}
      actions={<SubmitButton>Corriger</SubmitButton>}
    >
      <UploadNewOrModifyExistingDocument
        label="Fichier CSV"
        name="fichierCorrectionCandidatures"
        required
        formats={['csv']}
        state={validationErrors['fichierCorrectionCandidatures'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['fichierCorrectionCandidatures']}
      />
    </Form>
  );
};
