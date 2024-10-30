'use client';

import { FC, useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { UploadDocument } from '@/components/atoms/form/document/UploadDocument';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import {
  corrigerRéférencesDossierAction,
  CorrigerRéférencesDossierFormKeys,
} from './corrigerRéférencesDossier.action';

export const CorrigerRéférencesDossierForm: FC = () => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<CorrigerRéférencesDossierFormKeys>
  >({});

  return (
    <Form
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
        formats={['csv']}
        name="fichierCorrections"
        id="fichierCorrections"
        required
        state={validationErrors['fichierCorrections'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['fichierCorrections']}
      />
    </Form>
  );
};
