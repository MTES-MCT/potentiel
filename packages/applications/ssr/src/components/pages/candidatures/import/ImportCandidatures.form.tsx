'use client';

import { FC, useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { importCandidaturesAction } from './importCandidatures.actions';

type Période = {
  id: string;
  nom: string;
};

type AppelOffre = {
  id: string;
  nom: string;
  periode: ReadonlyArray<Période>;
};

export type ImporterCandidaturesFormProps = {
  appelOffres: ReadonlyArray<AppelOffre>;
};

export const ImporterCandidaturesForm: FC<ImporterCandidaturesFormProps> = ({ appelOffres }) => {
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  const [appelOffreSéléctionnée, setAppelOffreSéléctionnée] = useState<AppelOffre | undefined>(
    undefined,
  );
  const [périodeSélectionnée, setPériodeSélectionnée] = useState<Période | undefined>(undefined);

  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      action={importCandidaturesAction}
      heading="Importer les candidats de la période d'un appel d'offre"
      pendingModal={{
        id: 'form-import-candidatures',
        title: 'Import en cours',
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
            return setAppelOffreSéléctionnée(appelOffre);
          },
          'aria-required': true,
          required: true,
        }}
        placeholder="Sélectionnez l'appel d'offre"
        options={appelOffres.map((appelOffre) => ({
          label: appelOffre.nom,
          value: appelOffre.id,
        }))}
        state={validationErrors.includes('appelOffre') ? 'error' : 'default'}
        stateRelatedMessage="Appel d'offre obligatoire"
      />

      {appelOffreSéléctionnée && (
        <Select
          id="periode"
          label="Période"
          nativeSelectProps={{
            name: 'periode',
            onChange: (e) => {
              const période = appelOffreSéléctionnée.periode.find((p) => p.id === e.target.value);
              return setPériodeSélectionnée(période);
            },
            'aria-required': true,
            required: true,
          }}
          placeholder="Sélectionnez la période"
          options={appelOffreSéléctionnée.periode.map((p) => ({
            label: p.nom,
            value: p.id,
          }))}
        />
      )}

      {appelOffreSéléctionnée && périodeSélectionnée && (
        <p>
          Appel offre {appelOffreSéléctionnée.nom} / période {périodeSélectionnée.nom}
        </p>
      )}

      <div className="flex flex-col md:flex-row mx-auto">
        <SubmitButton>Importer</SubmitButton>
      </div>
    </Form>
  );
};
