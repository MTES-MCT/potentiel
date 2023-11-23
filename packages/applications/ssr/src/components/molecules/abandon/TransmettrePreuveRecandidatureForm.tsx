'use client';

import SelectNext from '@codegouvfr/react-dsfr/SelectNext';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import {
  TransmettrePreuveRecandidatureState,
  transmettrePreuveRecandidatureAction,
} from '@/app/laureat/[identifiant]/abandon/transmettre-preuve-recandidature/transmettrePreuveRecandidature.action';
import { Utilisateur } from '@/utils/getUtilisateur';
import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

type ProjetÀSélectionner = {
  identifiantProjet: string;
  dateDésignation: string;
  nom: string;
};

type TransmettrePreuveRecandidatureFormProps = {
  identifiantProjet: string;
  projetsÀSélectionner: Array<ProjetÀSélectionner>;
  utilisateur: Utilisateur;
};

const initialState: TransmettrePreuveRecandidatureState = {
  error: undefined,
  validationErrors: [],
};

export const TransmettrePreuveRecandidatureForm = ({
  identifiantProjet,
  projetsÀSélectionner,
  utilisateur,
}: TransmettrePreuveRecandidatureFormProps) => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(transmettrePreuveRecandidatureAction, initialState);

  const [projetSélectionné, setProjetSélectionné] = useState<ProjetÀSélectionner>();

  if (state.success) {
    router.push(`/laureat/${encodeURIComponent(identifiantProjet)}/abandon`);
  }

  return (
    <>
      {state.error && <Alert severity="error" title={state.error} className="mb-4" />}
      <SelectNext
        label="Choisir un projet comme preuve de recandidature"
        placeholder={`Sélectionner un projet`}
        nativeSelectProps={{
          onChange: ({ currentTarget: { value } }) => {
            setProjetSélectionné(
              projetsÀSélectionner.find((projet) => projet.identifiantProjet === value),
            );
          },
        }}
        options={projetsÀSélectionner.map((projet) => ({
          label: projet.nom,
          value: projet.identifiantProjet,
        }))}
      />
      <form action={formAction} method="post">
        <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
        <input type={'hidden'} value={utilisateur.email} name="utilisateur" />
        {projetSélectionné && (
          <>
            <input
              type={'hidden'}
              value={projetsÀSélectionner[0].identifiantProjet}
              name="preuveRecandidature"
            />
            <input
              type={'hidden'}
              value={projetsÀSélectionner[0].dateDésignation}
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
