'use client';
import { FC } from 'react';

import { Saisie } from './Saisie';

type ValidationProps = Saisie;
export const Validation: FC<ValidationProps> = ({
  typePersonne,
  nomReprésentantLégal,
  piècesJustificatives,
}) => (
  <>
    <p>
      Vous êtes sur le point de faire une demande de changement de représentant légal pour votre
      projet. <br />
      Veuillez vérifier l'ensemble des informations saisies et valider si tout est correct.
    </p>
    <div className="py-6">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="whitespace-nowrap">Type de personne :</div>
          <blockquote className="font-semibold italic">{typePersonne}</blockquote>
        </div>
        <div className="flex gap-2">
          <div className="whitespace-nowrap">Nom représentant légal :</div>
          <blockquote className="font-semibold italic">{nomReprésentantLégal}</blockquote>
        </div>
        <div className="flex flex-col gap-2">
          <div className="whitespace-nowrap">Pièces justificatives :</div>
          {piècesJustificatives.map((pièceJustificative) => (
            <ul>
              <li>{pièceJustificative}</li>
            </ul>
          ))}
        </div>
      </div>
    </div>
  </>
);
