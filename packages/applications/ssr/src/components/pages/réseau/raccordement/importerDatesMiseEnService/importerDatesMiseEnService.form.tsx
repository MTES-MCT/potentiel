'use client';

import { FC, useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { FormActionResult } from '@/utils/formAction';

export type ImporterDatesMiseEnServiceFormProps = {
  action: FormActionResult;
};

export const ImporterDatesMiseEnServiceForm: FC<ImporterDatesMiseEnServiceFormProps> = ({
  action,
}) => {
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);
  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      action={action}
      heading="Importer des dates de mise en service"
      pendingModal={{
        id: 'form-import-date-mise-en-service',
        title: 'Import en cours',
        children: 'Import des dates de mise en service en cours ...',
      }}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      successMessage={'dates de mise en service transmises'}
      actions={<SubmitButton>Importer</SubmitButton>}
    >
      <UploadDocument
        label="Fichier des dates de mise en service"
        format="csv"
        name="fichierDatesMiseEnService"
        required
        state={validationErrors.includes('fichierDatesMiseEnService') ? 'error' : 'default'}
      />
    </Form>
  );
};
