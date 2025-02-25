'use client';
import { FC } from 'react';
import { Alert } from '@codegouvfr/react-dsfr/Alert';
import { match } from 'ts-pattern';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { TypeSociété } from './SaisieTypeSociété.step';

type ValidationStepProps = {
  typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété?: TypeSociété;
  nomReprésentantLégal: string;
  piècesJustificatives: ReadonlyArray<string>;
  message: string;
};
export const ValidationStep: FC<ValidationStepProps> = ({
  typeReprésentantLégal,
  nomReprésentantLégal,
  piècesJustificatives,
  message,
}) => {
  const type = match(typeReprésentantLégal)
    .returnType<string>()
    .with('personne-physique', () => 'Personne physique')
    .with('personne-morale', () => 'Personne morale')
    .with('collectivité', () => 'Collectivité')
    .with('autre', () => `Autre`)
    .with('inconnu', () => 'Inconnu')
    .exhaustive();

  return (
    <div className="flex flex-col gap-4">
      <Alert severity="info" small description={<p>{message}</p>} />
      <div className="py-6">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="font-semibold">Type :</div>
            <blockquote>{type}</blockquote>
          </div>
          <div className="flex gap-2">
            <div className="font-semibold">Nom représentant légal :</div>
            <blockquote>{nomReprésentantLégal}</blockquote>
          </div>
          {piècesJustificatives.length > 0 && (
            <div>
              <span className="font-semibold">
                {piècesJustificatives.length === 1
                  ? `Pièce justificative`
                  : `Pièces justificatives`}{' '}
                :
              </span>
              <ul className="mt-2 ml-4 list-disc">
                {piècesJustificatives.map((pj) => (
                  <li key={pj}>{pj}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
