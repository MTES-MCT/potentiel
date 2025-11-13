'use client';
import { FC } from 'react';
import { Alert } from '@codegouvfr/react-dsfr/Alert';

import { Lauréat } from '@potentiel-domain/projet';

import { getTypeReprésentantLégalLabel } from '../getTypeReprésentantLégalLabel';

import { TypeSociété } from './SaisieTypeSociété.step';

type ValidationStepProps = {
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété?: TypeSociété;
  nomReprésentantLégal: string;
  piècesJustificatives: ReadonlyArray<string>;
  message: string;
};
export const ValidationStep: FC<ValidationStepProps> = ({
  typeReprésentantLégal,
  typeSociété,
  nomReprésentantLégal,
  piècesJustificatives,
  message,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Alert severity="info" small description={<p>{message}</p>} />
      <div className="py-6">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="font-semibold">Type :</div>
            <blockquote>{getTypeReprésentantLégalLabel(typeReprésentantLégal)}</blockquote>
          </div>
          {typeSociété && (
            <div className="flex gap-2">
              <div className="font-semibold">Type :</div>
              <blockquote>{typeSociété}</blockquote>
            </div>
          )}
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
