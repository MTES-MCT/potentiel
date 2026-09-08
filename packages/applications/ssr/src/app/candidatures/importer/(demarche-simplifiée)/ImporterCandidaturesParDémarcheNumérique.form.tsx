'use client';

import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import Notice from '@codegouvfr/react-dsfr/Notice';
import Table from '@codegouvfr/react-dsfr/Table';
import { type FC, useState } from 'react';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import {
  type ImporterCandidaturesParDémarcheNumériqueFormKeys,
  importerCandidaturesParDémarcheNumériqueAction,
} from './importerCandidaturesParDémarcheNumérique.action';

export type ImporterCandidaturesParDémarcheNumériqueFormProps = {
  appelOffre: string;
  période: string;
};

export const ImporterCandidaturesParDémarcheNumériqueForm: FC<
  ImporterCandidaturesParDémarcheNumériqueFormProps
> = ({ appelOffre, période }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ImporterCandidaturesParDémarcheNumériqueFormKeys>
  >({});

  return (
    <>
      <div className="mb-4 text-lg">
        Importer des candidats de la <span className="font-semibold">période {période}</span> de
        l'appel d'offres <span className="font-semibold">{appelOffre}</span> depuis{' '}
        <span className="font-semibold">Démarche Numérique</span>.
      </div>
      <div className="flex flex-col items-start lg:flex-row gap-6">
        <Form
          action={importerCandidaturesParDémarcheNumériqueAction}
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
                  defaultChecked: true,
                },
              },
            ]}
          />
        </Form>
        <Notice
          severity="info"
          className="flex-auto md:max-w-lg items-stretch mt-4"
          title="Candidatures soumises sur Démarche Numérique"
          description={
            <span className="flex flex-col gap-2">
              <span>
                Seul le fichier CSV contenant le résultat de l'instruction de la CRE doit être
                transmis ici, les colonnes attendues sont les suivantes :
              </span>
              <Table
                className="lg:mx-4 my-4 border-spacing-0"
                headers={['Colonne', 'Format', 'Règle appliquée']}
                data={[
                  ['numeroDossierDN', 'chaîne de caractères', 'requis'],
                  ['statut', '"retenu" ou "éliminé"', 'requis'],
                  ['note', 'nombre', 'optionnel'],
                  ['motifElimination', 'chaîne de caractères', 'requis pour les projets éliminés'],
                  [
                    'volumeReserve',
                    '"oui" ou "non"',
                    'requis pour les candidats retenus des périodes avec volume réservé',
                  ],
                ]}
              />
            </span>
          }
        />
      </div>
    </>
  );
};
