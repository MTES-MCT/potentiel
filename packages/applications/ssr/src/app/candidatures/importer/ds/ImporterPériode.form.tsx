'use client';

import { FC, useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import Input from '@codegouvfr/react-dsfr/Input';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';

import { PlainType } from '@potentiel-domain/core';
import { Période } from '@potentiel-domain/periode';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';

import { importerPériodeAction, ImporterPériodeFormKeys } from './importerPériode.action';

export type ImporterPériodeFormProps = {
  périodes: PlainType<Période.ListerPériodesReadModel>;
};
export const ImporterPériodeForm: FC<ImporterPériodeFormProps> = ({ périodes }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ImporterPériodeFormKeys>
  >({});
  const appelOffres = [...new Set(périodes.items.map((p) => p.identifiantPériode.appelOffre))];
  const [appelOffre, setAppelOffre] = useState(
    périodes.items.length === 1 ? périodes.items[0].identifiantPériode.appelOffre : '',
  );
  const defaultPériode =
    périodes.items.length === 1 ? périodes.items[0].identifiantPériode.période : '';

  return (
    <Form
      action={importerPériodeAction}
      heading="Importer les candidats de la période d'un appel d'offres"
      pendingModal={{
        id: 'form-import-candidatures',
        title: 'Importer des candidats',
        children: 'Import des candidats en cours ...',
      }}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      successMessage={'candidat(s) importé(s)'}
      actions={<SubmitButton>Importer</SubmitButton>}
    >
      <div className="flex justify-between">
        <Select
          label="Appel Offre"
          options={appelOffres.map((appelOffre) => ({ label: appelOffre, value: appelOffre }))}
          nativeSelectProps={{
            name: 'appelOffre',
            value: appelOffre,
            onChange: (ev) => setAppelOffre(ev.target.value),
            required: true,
          }}
          state={validationErrors['appelOffre'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['appelOffre']}
        />

        <Select
          label="Période"
          options={
            périodes.items
              .filter((période) => période.identifiantPériode.appelOffre == appelOffre)
              .map(({ identifiantPériode }) => ({
                label: identifiantPériode.période,
                value: identifiantPériode.période,
              })) ?? []
          }
          nativeSelectProps={{
            name: 'periode',
            defaultValue: defaultPériode,
            required: true,
          }}
          state={validationErrors['periode'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['periode']}
          disabled={!appelOffre}
        />
      </div>
      <Input
        label="Numéro de la démarche"
        className="max-w-64"
        nativeInputProps={{
          name: 'demarcheId',
          type: 'number',
          required: true,
        }}
        state={validationErrors['demarcheId'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['demarcheId']}
      />
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
      />{' '}
    </Form>
  );
};
