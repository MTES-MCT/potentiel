'use client';

import { FC, useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { importerDatesMiseEnServiceAction } from './importDatesMiseEnService.action';

export const fileKey = 'fichierDatesMiseEnService';

export const ImporterDatesMiseEnServiceForm: FC = () => {
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);
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
        name={fileKey}
        id={fileKey}
        required
        state={validationErrors.includes(fileKey) ? 'error' : 'default'}
      />
    </Form>
  );
};
