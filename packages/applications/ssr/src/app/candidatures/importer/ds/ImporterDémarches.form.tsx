'use client';

import { FC, useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import Input from '@codegouvfr/react-dsfr/Input';

import { PlainType } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import { importerDémarchesAction, ImporterDémarchesFormKeys } from './importerDémarches.action';

type ImporterDémarchesFormProps = {
  appelsOffre: PlainType<AppelOffre.AppelOffreReadModel[]>;
};
export const ImporterDémarchesForm: FC<ImporterDémarchesFormProps> = ({ appelsOffre }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ImporterDémarchesFormKeys>
  >({});
  const [appelOffre, setAppelOffre] = useState('PPE2 - ZNI');

  return (
    <Form
      action={importerDémarchesAction}
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
      <Select
        label="Appel Offre"
        options={appelsOffre.map((appelOffre) => ({ label: appelOffre.id, value: appelOffre.id }))}
        nativeSelectProps={{
          name: 'appelOffre',
          value: appelOffre,
          onChange: (ev) => setAppelOffre(ev.target.value),
        }}
        state={validationErrors['appelOffre'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['appelOffre']}
      />

      <Select
        label="Période"
        options={
          appelsOffre
            .find((ao) => ao.id == appelOffre)
            ?.periodes?.map(({ id }) => ({ label: id, value: id })) ?? []
        }
        nativeSelectProps={{
          name: 'periode',
          defaultValue: '2',
        }}
        state={validationErrors['periode'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['periode']}
        disabled={!appelOffre}
      />

      <Input
        label="Numéro de la démarche"
        nativeInputProps={{
          name: 'dossierId',
          type: 'number',
          defaultValue: '23179946',
        }}
        state={validationErrors['dossierId'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dossierId']}
      />
    </Form>
  );
};
