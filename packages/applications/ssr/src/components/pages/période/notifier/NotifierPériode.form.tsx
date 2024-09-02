'use client';

import Select from '@codegouvfr/react-dsfr/SelectNext';
import { FC, useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { notifierPériodeAction } from './notifierPériode.action';

export type NotifierPériodeFormProps = {
  appelOffres: ReadonlyArray<{
    identifiantAppelOffre: string;
    libellé: string;
    périodes: ReadonlyArray<{
      identifiantPériode: string;
      libellé: string;
    }>;
  }>;
};
export const NotifierPériodeForm: FC<NotifierPériodeFormProps> = ({ appelOffres }) => {
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);
  const [appelOffreSélectionné, selectionnerAppelOffre] = useState('');
  const [périodeSélectionnée, selectionnerPériode] = useState('');

  const appelOffreOptions = appelOffres.map((appelOffre) => ({
    label: appelOffre.libellé,
    value: appelOffre.identifiantAppelOffre,
  }));

  const périodeOptions =
    appelOffres
      .find((appelOffre) => appelOffre.identifiantAppelOffre === appelOffreSélectionné)
      ?.périodes.map((période) => ({
        label: période.libellé,
        value: période.identifiantPériode,
      })) ?? [];

  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      action={notifierPériodeAction}
      heading="Notifier les candidats de la période d'un appel d'offres"
      pendingModal={{
        id: 'form-import-candidatures',
        title: 'Notifier une période',
        children: (
          <>
            Notification de la période {périodeSélectionnée} de l'appel d'offre{' '}
            {appelOffreSélectionné} en cours ...
          </>
        ),
      }}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      successMessage={'candidats importés'}
      actions={
        <SubmitButton disabledCondition={() => !appelOffreSélectionné || !périodeSélectionnée}>
          Notifier
        </SubmitButton>
      }
    >
      <Select
        label="Appel d'offres"
        nativeSelectProps={{
          name: 'appelOffre',
          required: true,
          onChange: ({ currentTarget: { value } }) => selectionnerAppelOffre(value),
        }}
        options={appelOffreOptions}
        placeholder="Sélectionner un appel d'offres"
        state={validationErrors.includes('appelOffre') ? 'error' : 'default'}
        stateRelatedMessage="Appel d'offres obligatoire"
      />
      <Select
        label="Période"
        nativeSelectProps={{
          name: 'periode',
          required: true,
          onChange: ({ currentTarget: { value } }) => selectionnerPériode(value),
        }}
        options={périodeOptions}
        placeholder="Sélectionner une période"
        state={validationErrors.includes('periode') ? 'error' : 'default'}
        stateRelatedMessage="Période obligatoire"
      />
    </Form>
  );
};
