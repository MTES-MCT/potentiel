'use client';
import { FC } from 'react';
import { Alert } from '@codegouvfr/react-dsfr/Alert';
import { match } from 'ts-pattern';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

type ValidationStepProps = {
  typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.RawType;
  nomReprésentantLégal: string;
  piècesJustificatives: ReadonlyArray<string>;
};
export const ValidationStep: FC<ValidationStepProps> = ({
  typeReprésentantLégal,
  nomReprésentantLégal,
  piècesJustificatives,
}) => {
  const nom = match(typeReprésentantLégal)
    .returnType<string>()
    .with('personne-physique', () => 'Personne physique')
    .with('personne-morale', () => 'Personne morale')
    .with('collectivité', () => 'Collectivité')
    .with('autre', () => `Autre`)
    .with('inconnu', () => 'Inconnu')
    .exhaustive();

  return (
    <div className="flex flex-col gap-4">
      <Alert
        severity="info"
        small
        description={
          <p>
            Vous êtes sur le point de modifier le représentant légal du projet. Veuillez vérifier
            l'ensemble des informations saisies et confirmer si tout est correct.
          </p>
        }
      />
      <div className="py-6">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="font-semibold">Type :</div>
            <blockquote>{nom}</blockquote>
          </div>
          <div className="flex gap-2">
            <div className="font-semibold">Nom représentant légal :</div>
            <blockquote>{nomReprésentantLégal}</blockquote>
          </div>
          {piècesJustificatives.length > 0 && (
            <div className="flex flex-row gap-2">
              <div className="font-semibold">Pièces justificatives :</div>
              <div className="pl-2">
                <ul className="list-disc">
                  {piècesJustificatives.map((pièceJustificative) => (
                    <li key={pièceJustificative}>{pièceJustificative}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
