'use client';

import { FC, useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';

import { importerCandidaturesAction } from './importerCandidatures.action';

type Période = {
  id: string;
  nom: string;
};

type AppelOffre = {
  id: string;
  nom: string;
  période: ReadonlyArray<Période>;
};

export type ImporterCandidaturesFormProps = {
  appelOffres: ReadonlyArray<AppelOffre>;
};

export const ImporterCandidaturesForm: FC<ImporterCandidaturesFormProps> = ({ appelOffres }) => {
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  const [appelOffresSéléctionné, setAppelOffresSéléctionné] = useState<AppelOffre | undefined>(
    undefined,
  );
  const [, setPériodeSélectionnée] = useState<Période | undefined>(undefined);

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
    >
      <Select
        id="appelOffre"
        label="Appel d'offre"
        nativeSelectProps={{
          name: 'appelOffre',
          onChange: (e) => {
            const appelOffre = appelOffres.find((appelOffre) => appelOffre.id === e.target.value);
            return setAppelOffresSéléctionné(appelOffre);
          },
          'aria-required': true,
          required: true,
        }}
        placeholder="Sélectionnez l'appel d'offres"
        options={appelOffres.map((appelOffre) => ({
          label: appelOffre.nom,
          value: appelOffre.id,
        }))}
        state={validationErrors.includes('appelOffre') ? 'error' : 'default'}
        stateRelatedMessage="Appel d'offres obligatoire"
      />

      <Select
        id="periode"
        label="Période"
        nativeSelectProps={{
          name: 'periode',
          onChange: (e) => {
            if (appelOffresSéléctionné) {
              const période = appelOffresSéléctionné.période.find((p) => p.id === e.target.value);
              return setPériodeSélectionnée(période);
            }
          },
          'aria-required': true,
          required: true,
        }}
        placeholder={
          appelOffresSéléctionné
            ? 'Sélectionnez la période'
            : "Veuillez sélectionner un appel d'offres"
        }
        options={
          appelOffresSéléctionné
            ? appelOffresSéléctionné.période.map((p) => ({
                label: p.nom,
                value: p.id,
              }))
            : []
        }
        stateRelatedMessage="Période obligatoire"
      />

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
