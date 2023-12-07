'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import SelectNext from '@codegouvfr/react-dsfr/SelectNext';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Button from '@codegouvfr/react-dsfr/Button';

import {
  TransmettrePreuveRecandidatureState,
  transmettrePreuveRecandidatureAction,
} from '@/app/laureat/[identifiant]/abandon/transmettre-preuve-recandidature/transmettrePreuveRecandidature.action';
import { useRouter } from 'next/navigation';
import { encodeParameter } from '@/utils/encodeParameter';

type ProjetÀSélectionner = {
  identifiantProjet: string;
  dateDésignation: string;
  nom: string;
};

type TransmettrePreuveRecandidatureFormProps = {
  identifiantProjet: string;
  projetsÀSélectionner: Array<ProjetÀSélectionner>;
};

const initialState: TransmettrePreuveRecandidatureState = {
  error: undefined,
  validationErrors: [],
};

export const TransmettrePreuveRecandidatureForm = ({
  identifiantProjet,
  projetsÀSélectionner,
}: TransmettrePreuveRecandidatureFormProps) => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(transmettrePreuveRecandidatureAction, initialState);

  if (state.success) {
    router.push(`/laureat/${encodeParameter(identifiantProjet)}/abandon`);
  }

  const [projetSélectionné, setProjetSélectionné] = useState<{
    identifiantProjet: ProjetÀSélectionner['identifiantProjet'];
    dateDésignation: ProjetÀSélectionner['dateDésignation'];
  }>();

  return (
    <>
      {state.error && <Alert severity="error" title={state.error} className="mb-4" />}
      <SelectNext
        label="Choisir un projet comme preuve de recandidature"
        placeholder={`Sélectionner un projet`}
        nativeSelectProps={{
          onChange: ({ currentTarget: { value } }) => {
            const projet = projetsÀSélectionner.find(
              (projet) => projet.identifiantProjet === value,
            );

            if (projet) {
              setProjetSélectionné({
                identifiantProjet: projet.identifiantProjet,
                dateDésignation: projet.dateDésignation,
              });
            }
          },
        }}
        options={projetsÀSélectionner.map((projet) => ({
          label: projet.nom,
          value: projet.identifiantProjet,
        }))}
      />
      <form action={formAction} method="post">
        <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
        {projetSélectionné && (
          <>
            <input
              type={'hidden'}
              value={projetSélectionné.identifiantProjet}
              name="preuveRecandidature"
            />
            <input
              type={'hidden'}
              value={projetSélectionné.dateDésignation}
              name="dateDesignation"
            />
          </>
        )}

        <Button
          type="submit"
          priority="primary"
          nativeButtonProps={{
            'aria-disabled': pending || !projetSélectionné,
            disabled: pending || !projetSélectionné,
          }}
          className="bg-blue-france-sun-base text-white"
        >
          Transmettre la preuve de recandidature
        </Button>
      </form>
    </>
  );
};
