'use client';

import { FC, useState } from 'react';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Table from '@codegouvfr/react-dsfr/Table';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Link } from '@/components/atoms/LinkNoPrefetch';

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
      <div className="flex flex-col items-start lg:flex-row gap-6">
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
          className="flex-1"
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
        <Alert
          severity="info"
          small
          className="flex-auto md:max-w-lg items-stretch mt-4"
          description={
            <div className="flex flex-col gap-2">
              <p>
                Pour ce type d'import, les candidatures proviennent de{' '}
                <Link target="_blank" href="https://demarches.numerique.gouv.fr">
                  Démarches Simplifiées
                </Link>
                .
              </p>
              <p>
                Seul le fichier contenant le résultat de l'instruction de la CRE doit être transmis
                ici, au format CSV, avec les colonnes suivantes :
              </p>
              <Table
                className="lg:mx-4 my-4 border-spacing-0"
                headers={['Colonne', 'Format', 'Optionnel']}
                data={[
                  ['numeroDossierDS', 'chaîne de caractères', 'non'],
                  ['statut', 'classé ou éliminé', 'non'],
                  ['note', 'nombre', 'non'],
                  [
                    'motifElimination',
                    'chaîne de caractères',
                    'oui, sauf en cas de statut éliminé',
                  ],
                ]}
              />
            </div>
          }
        />
      </div>
    </>
  );
};
