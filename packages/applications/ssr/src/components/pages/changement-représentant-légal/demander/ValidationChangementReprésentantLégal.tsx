'use client';
import { FC } from 'react';
import { Alert } from '@codegouvfr/react-dsfr/Alert';

import { SaisieChangementReprésentantLégal } from './SaisieChangementReprésentantLégal';

type ValidationChangementReprésentantLégalProps = SaisieChangementReprésentantLégal;
export const ValidationChangementReprésentantLégal: FC<
  ValidationChangementReprésentantLégalProps
> = ({ typePersonne, nomReprésentantLégal, piècesJustificatives }) => (
  <div className="flex flex-col gap-4">
    <Alert
      severity="info"
      small
      description={
        <p>
          Vous êtes sur le point de faire une demande de changement de représentant légal pour votre
          projet. Veuillez vérifier l'ensemble des informations saisies et confirmer si tout est
          correct.
        </p>
      }
    />
    <div className="py-6">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div>Type de personne :</div>
          <blockquote className="font-semibold italic">{typePersonne}</blockquote>
        </div>
        <div className="flex gap-2">
          <div>Nom représentant légal :</div>
          <blockquote className="font-semibold italic">{nomReprésentantLégal}</blockquote>
        </div>
        <div className="flex flex-row gap-2">
          <div>Pièces justificatives :</div>
          <div className="pl-2">
            {piècesJustificatives.map((pièceJustificative, index) => (
              <ul className="list-disc">
                <li key={`pièce-justificative-${index}`}>{pièceJustificative}</li>
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
