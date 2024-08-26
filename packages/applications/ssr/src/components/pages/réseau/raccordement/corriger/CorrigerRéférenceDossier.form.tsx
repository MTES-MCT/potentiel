'use client';

import { FC, useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { corrigerRéférencesDossierAction } from './CorrigerRéférenceDossier.action';

export const CorrigerRéférenceDossierForm: FC = () => {
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);
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
      successMessage={'dates de mise en service transmises'}
    >
      <UploadDocument
        label="Fichier des corrections"
        format="csv"
        name="fichierCorrections"
        required
        state={validationErrors.includes('fichierCorrections') ? 'error' : 'default'}
      />
      <div className="flex flex-col md:flex-row">
        <SubmitButton>Corriger</SubmitButton>
      </div>
    </Form>
  );
};
