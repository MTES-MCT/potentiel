'use client';
import { FC } from 'react';
import { Alert } from '@codegouvfr/react-dsfr/Alert';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { getInfosBasedOnTypeReprésentant } from './_utils/getInfosBasedOnTypeReprésentant';

type ValidationStepProps = {
  typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.RawType;
  nomReprésentantLégal: string;
};
export const ValidationStep: FC<ValidationStepProps> = ({
  typeReprésentantLégal,
  nomReprésentantLégal,
}) => {
  const { nom } = getInfosBasedOnTypeReprésentant(typeReprésentantLégal);

  return (
    <div className="flex flex-col gap-4">
      <Alert
        severity="info"
        small
        description={
          <p>
            Vous êtes sur le point de corriger le représentant légal du projet. Veuillez vérifier
            l'ensemble des informations saisies et confirmer si tout est correct.
          </p>
        }
      />
      <div className="py-6">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div>Type de personne :</div>
            <blockquote className="font-semibold italic">{nom}</blockquote>
          </div>
          <div className="flex gap-2">
            <div>Nom représentant légal :</div>
            <blockquote className="font-semibold italic">{nomReprésentantLégal}</blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};
