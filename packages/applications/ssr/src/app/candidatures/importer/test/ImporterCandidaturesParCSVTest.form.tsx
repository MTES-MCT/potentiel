'use client';

import { FC, useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  importerCandidaturesAction,
  ImporterCandidaturesFormKeys,
} from './importerCandidatures.action';

export const ImporterCandidaturesParCSVTestForm: FC = () => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ImporterCandidaturesFormKeys>
  >({});

  return (
    <Form
      action={importerCandidaturesAction}
      pendingModal={{
        id: 'form-import-candidatures',
        title: 'Importer des candidats',
        children: 'Import des candidats en cours ...',
      }}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Importer',
      }}
    >
      <UploadNewOrModifyExistingDocument
        label="Fichier CSV"
        name="fichierImportCandidature"
        required
        formats={['csv']}
        state={validationErrors['fichierImportCandidature'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['fichierImportCandidature']}
      />
    </Form>
  );
};
