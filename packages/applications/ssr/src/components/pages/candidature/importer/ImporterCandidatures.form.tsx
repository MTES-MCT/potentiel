'use client';

import { FC, useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { ValidationErrors } from '@/utils/formAction';

import { importerCandidaturesAction } from './importerCandidatures.action';

export const ImporterCandidaturesForm: FC = () => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
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
      actions={<SubmitButton>Importer</SubmitButton>}
    >
      <UploadDocument
        label="Fichier CSV"
        id={'fichierImport'}
        name={'fichierImport'}
        required
        format="csv"
        state={validationErrors['fichierImport'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['fichierImport']}
      />
    </Form>
  );
};
