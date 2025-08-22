'use client';

import { type FC, useState } from 'react';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import type { ValidationErrors } from '@/utils/formAction';
import {
  type CorrigerRéférencesDossierFormKeys,
  corrigerRéférencesDossierAction,
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
      actions={<SubmitButton>Corriger</SubmitButton>}
    >
      <UploadNewOrModifyExistingDocument
        label="Fichier des corrections"
        formats={['csv']}
        name="fichierCorrections"
        required
        state={validationErrors.fichierCorrections ? 'error' : 'default'}
        stateRelatedMessage={validationErrors.fichierCorrections}
      />
    </Form>
  );
};
