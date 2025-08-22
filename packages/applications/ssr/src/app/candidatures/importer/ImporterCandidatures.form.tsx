'use client';

import { type FC, useState } from 'react';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import type { ValidationErrors } from '@/utils/formAction';
import {
  type ImporterCandidaturesFormKeys,
  importerCandidaturesAction,
} from './importerCandidatures.action';

export const ImporterCandidaturesForm: FC = () => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ImporterCandidaturesFormKeys>
  >({});

  return (
    <Form
      action={importerCandidaturesAction}
      heading="Importer les candidats de la période d'un appel d'offres"
      pendingModal={{
        id: 'form-import-candidatures',
        title: 'Importer des candidats',
        children: 'Import des candidats en cours ...',
      }}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={<SubmitButton>Importer</SubmitButton>}
    >
      <UploadNewOrModifyExistingDocument
        label="Fichier CSV"
        name="fichierImportCandidature"
        required
        formats={['csv']}
        state={validationErrors.fichierImportCandidature ? 'error' : 'default'}
        stateRelatedMessage={validationErrors.fichierImportCandidature}
      />
    </Form>
  );
};
