'use client';

import { FC, useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';

import { importerCandidaturesAction } from './importerCandidatures.action';

export const ImporterCandidaturesForm: FC = () => {
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);
  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      action={importerCandidaturesAction}
      heading="Importer les candidats de la période d'un appel d'offres"
      pendingModal={{
        id: 'form-import-candidatures',
        title: 'Importer des candidats',
        children: 'Import des candidats en cours ...',
      }}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      successMessage={'candidats importés'}
    >
      <UploadDocument
        label="Fichier CSV"
        id="fichierImport"
        name="fichierImport"
        required
        format="csv"
        state={validationErrors.includes('fichierImport') ? 'error' : 'default'}
        stateRelatedMessage="Fichier CSV obligatoire"
      />

      <div className="flex flex-col md:flex-row">
        <SubmitButton>Importer</SubmitButton>
      </div>
    </Form>
  );
};
