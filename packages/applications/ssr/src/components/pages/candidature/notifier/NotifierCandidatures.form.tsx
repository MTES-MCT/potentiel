'use client';

import { FC, useEffect, useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import Button from '@codegouvfr/react-dsfr/Button';
import { createModal } from '@codegouvfr/react-dsfr/Modal';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { notifierCandidaturesAction } from './notifierCandidatures.action';

type Période = {
  id: string;
  nom: string;
};

type AppelOffre = {
  id: string;
  nom: string;
  périodes: ReadonlyArray<Période>;
};

export type NotifierCandidaturesFormProps = {
  appelOffres: ReadonlyArray<AppelOffre>;
};

export const NotifierCandidaturesForm: FC<NotifierCandidaturesFormProps> = ({ appelOffres }) => {
  const [appelOffreSéléctionnée, setAppelOffreSéléctionnée] = useState<AppelOffre | undefined>(
    undefined,
  );
  const [périodeSélectionnée, setPériodeSélectionnée] = useState<Période | undefined>(undefined);
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);
  const [nbCandidaturesPourPériode, setNbCandidaturesPourPériode] = useState(0);

  const [modal] = useState(
    createModal({ id: `confirmation-modal-notifier`, isOpenedByDefault: false }),
  );

  useEffect(() => {
    if (!périodeSélectionnée || !appelOffreSéléctionnée) {
      return;
    }
    const abortController = new AbortController();

    setNbCandidaturesPourPériode(0);
    const params = new URLSearchParams({
      appelOffre: appelOffreSéléctionnée.id,
      periode: périodeSélectionnée.id,
    });
    fetch(`/candidatures/notifier/count?${params}`, { signal: abortController.signal })
      .then((response) => response.json())
      .then(({ count }: { count: number }) => {
        setNbCandidaturesPourPériode(count);
      });

    return () => {
      abortController.abort();
    };
  }, [périodeSélectionnée, appelOffreSéléctionnée]);

  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      action={notifierCandidaturesAction}
      heading="Notifier les candidats de la période d'un appel d'offres"
      pendingModal={{
        id: 'form-notify-candidatures',
        title: 'Notifier des candidats',
        children: 'Notification des candidats en cours ...',
      }}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      onSubmit={() => modal.close()}
      successMessage={'candidats notifiés'}
      actions={
        <Button
          priority="primary"
          className="bg-dsfr-background-active-blueFrance-default"
          disabled={!périodeSélectionnée}
          onClick={() => modal.open()}
          type="button"
        >
          Notifier
        </Button>
      }
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
              const période = appelOffreSéléctionnée.périodes.find((p) => p.id === e.target.value);
              return setPériodeSélectionnée(période);
            },
            'aria-required': true,
            required: true,
          }}
          placeholder="Sélectionnez la période"
          options={appelOffreSéléctionnée.périodes.map((p) => ({
            label: p.nom,
            value: p.id,
          }))}
        />
      )}

      <modal.Component title="Confirmation" concealingBackdrop={false}>
        <div className="flex flex-col mt-2 gap-5">
          Êtes-vous sûr de vouloir notifier la {périodeSélectionnée?.nom} période de l'appel d'offre{' '}
          {appelOffreSéléctionnée?.nom} ?{' '}
          {nbCandidaturesPourPériode ? (
            <>{nbCandidaturesPourPériode} candidats seront notifiés</>
          ) : null}
          <div className="flex flex-row justify-end gap-2">
            <Button type="button" priority="secondary" onClick={() => modal.close()}>
              Non
            </Button>
            <SubmitButton disabledCondition={() => !nbCandidaturesPourPériode}>Oui</SubmitButton>
          </div>
        </div>
      </modal.Component>
    </Form>
  );
};
