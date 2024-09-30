'use client';

import { FC, useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import { corrigerRéférencesDossierAction } from './CorrigerRéférenceDossier.action';

export const CorrigerRéférenceDossierForm: FC = () => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      action={corrigerRéférencesDossierAction}
      heading="Corriger des références de dossier de raccordement"
      pendingModal={{
        id: 'form-corriger-references-dossier',
        title: 'Correction en cours',
        children: 'Correction des références de dossier de raccordement en cours',
      }}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      successMessage={'références dossier modifiées'}
      actions={<SubmitButton>Corriger</SubmitButton>}
    >
      <UploadDocument
        label="Fichier des corrections"
        format="csv"
        name={'fichierCorrectionRéférence'}
        id={'fichierCorrectionRéférence'}
        required
        state={validationErrors['fichierCorrectionRéférence'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['fichierCorrectionRéférence']}
      />
    </Form>
  );
};
