'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { notifierPériodeAction } from './notifierPériode.action';

type Période = {
  identifiantPériode: string;
  libellé: string;
};

export type NotifierPériodeFormProps = {
  appelOffres: ReadonlyArray<{
    identifiantAppelOffre: string;
    libellé: string;
    périodes: ReadonlyArray<Période>;
  }>;
};
export const NotifierPériodeForm: FC<NotifierPériodeFormProps> = ({ appelOffres }) => {
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);
  const [appelOffreSélectionné, sélectionnerAppelOffre] = useState('');
  const [périodeSélectionnée, sélectionnerPériode] = useState('');

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
      className=""
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
      <div className="flex flex-row gap-8 items-center">
        <div className="flex-1">
          <Select
            label="Appel d'offres"
            nativeSelectProps={{
              name: 'appelOffre',
              required: true,
              onChange: ({ currentTarget: { value } }) => sélectionnerAppelOffre(value),
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
              onChange: ({ currentTarget: { value } }) => sélectionnerPériode(value),
            }}
            options={périodeOptions}
            placeholder="Sélectionner une période"
            state={validationErrors.includes('periode') ? 'error' : 'default'}
            stateRelatedMessage="Période obligatoire"
          />
        </div>

        <Alert
          className="flex-1"
          severity="info"
          title="Informations sur la période"
          description={
            <div>
              <Link href={Routes.Candidature.lister(appelOffreSélectionné, périodeSélectionnée)}>
                Accéder aux candidatures de la période sélectionnée
              </Link>
            </div>
          }
        />
      </div>
    </Form>
  );
};
