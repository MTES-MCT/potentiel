'use client';

import { FC, useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';

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
      actionButtons={{
        submitButtonLabel: 'Corriger',
      }}
    >
      <UploadNewOrModifyExistingDocument
        label="Fichier des corrections"
        formats={['csv']}
        name="fichierCorrections"
        required
        state={validationErrors['fichierCorrections'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['fichierCorrections']}
      />
    </Form>
  );
};
