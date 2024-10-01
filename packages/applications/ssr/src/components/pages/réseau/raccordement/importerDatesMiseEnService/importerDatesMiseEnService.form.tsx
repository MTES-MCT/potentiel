'use client';

import { FC, useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import {
  importerDatesMiseEnServiceAction,
  ImporterDatesMiseEnServiceFormKeys,
} from './importDatesMiseEnService.action';

export const ImporterDatesMiseEnServiceForm: FC = () => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ImporterDatesMiseEnServiceFormKeys>
  >({});

  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      action={importerDatesMiseEnServiceAction}
      heading="Importer des dates de mise en service"
      pendingModal={{
        id: 'form-import-date-mise-en-service',
        title: 'Import en cours',
        children: 'Import des dates de mise en service en cours ...',
      }}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      successMessage={'date(s) de mise en service transmise(s)'}
      actions={<SubmitButton>Importer</SubmitButton>}
    >
      <UploadDocument
        label="Fichier des dates de mise en service"
        format="csv"
        name="fichierDatesMiseEnService"
        id="fichierDatesMiseEnService"
        required
        state={validationErrors['fichierDatesMiseEnService'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['fichierDatesMiseEnService']}
      />
    </Form>
  );
};
