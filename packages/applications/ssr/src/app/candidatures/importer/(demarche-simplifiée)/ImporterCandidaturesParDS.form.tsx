'use client';

import { FC, useState } from 'react';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';

import {
  importerCandidaturesParDSAction,
  ImporterCandidaturesParDSFormKeys,
} from './importerCandidaturesParDS.action';

export type ImporterCandidaturesParDSFormProps = {
  appelOffre: string;
  période: string;
};

export const ImporterCandidaturesParDSForm: FC<ImporterCandidaturesParDSFormProps> = ({
  appelOffre,
  période,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ImporterCandidaturesParDSFormKeys>
  >({});

  return (
    <>
      <div className="mb-4 text-lg">
        Importer des candidats depuis <span className="font-semibold">Démarche simplifiée</span> de
        la <span className="font-semibold">période {période}</span> de l'appel d'offres{' '}
        <span className="font-semibold">{appelOffre}</span>
      </div>
      <Form
        action={importerCandidaturesParDSAction}
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
        <input type="hidden" name="appelOffre" value={appelOffre} />
        <input type="hidden" name="periode" value={période} />

        <UploadNewOrModifyExistingDocument
          label="Fichier CSV d'instruction des candidatures"
          name="fichierInstruction"
          required
          formats={['csv']}
          state={validationErrors['fichierInstruction'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['fichierInstruction']}
        />
        <Checkbox
          id="test"
          options={[
            {
              label: 'Vérifier que les données sont correctes, sans import réel',
              nativeInputProps: {
                name: 'test',
                value: 'true',
                defaultChecked: true, // TODO enlever avant de merger
              },
            },
          ]}
        />
      </Form>
    </>
  );
};
