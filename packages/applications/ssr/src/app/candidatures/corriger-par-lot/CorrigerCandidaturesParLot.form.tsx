'use client';

import { FC, useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  corrigerCandidaturesParLotAction,
  CorrigerCandidaturesParLotFormKeys,
} from './CorrigerCandidaturesParLot.action';

export const CorrigerCandidaturesParLotForm: FC = () => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<CorrigerCandidaturesParLotFormKeys>
  >({});

  return (
    <Form
      action={corrigerCandidaturesParLotAction}
      heading="Corriger un import de candidatures"
      pendingModal={{
        id: 'form-corriger-candidatures',
        title: 'Corriger un import de candidat(s)',
        children: 'Correction des candidats en cours...',
      }}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitButtonLabel: 'Corriger',
      }}
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
