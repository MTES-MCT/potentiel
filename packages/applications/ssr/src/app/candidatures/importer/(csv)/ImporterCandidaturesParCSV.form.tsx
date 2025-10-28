'use client';

import { FC, useState } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';
import { Link } from '@/components/atoms/LinkNoPrefetch';

import {
  importerCandidaturesParCSVAction,
  ImporterCandidaturesParCSVFormKeys,
} from './importerCandidaturesParCSV.action';

export type ImporterCandidaturesParCSVFormProps = {
  appelOffre: string;
  période: string;
  modeMultiple: boolean;
};

export const ImporterCandidaturesParCSVForm: FC<ImporterCandidaturesParCSVFormProps> = ({
  appelOffre,
  période,
  modeMultiple,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ImporterCandidaturesParCSVFormKeys>
  >({});

  return (
    <>
      <div className="mb-4 text-lg">
        Importer des candidats <span className="font-semibold">par CSV</span>{' '}
        {modeMultiple ? (
          <>
            pour <span className="font-semibold">plusieurs appels d'offres et périodes</span>
          </>
        ) : (
          <>
            de la <span className="font-semibold">période {période}</span> de l'appel d'offres{' '}
            <span className="font-semibold">{appelOffre}</span>
          </>
        )}
      </div>

      <div className="flex flex-col items-start lg:flex-row gap-6">
        <Form
          action={importerCandidaturesParCSVAction}
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
          <input type="hidden" name="modeMultiple" value={modeMultiple ? 'true' : 'false'} />

          <UploadNewOrModifyExistingDocument
            label="Fichier CSV"
            name="fichierImportCandidature"
            required
            formats={['csv']}
            state={validationErrors['fichierImportCandidature'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['fichierImportCandidature']}
          />
        </Form>
        <Alert
          severity="info"
          small
          className="flex-auto md:max-w-lg items-stretch mt-4"
          description={
            <div className="py-4 text-justify">
              Il est possible de corriger des candidat existants:
              <ul className="list-disc px-4">
                <li>
                  au cas par cas, via la{' '}
                  <Link href={Routes.Candidature.lister()}>page des candidatures</Link>
                </li>
                <li>
                  par lot (CSV), via la{' '}
                  <Link href={Routes.Candidature.corrigerParLot}>page de correction</Link>
                </li>
              </ul>
            </div>
          }
        />
      </div>
    </>
  );
};
