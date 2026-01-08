'use client';
import { FC } from 'react';
import { Notice } from '@codegouvfr/react-dsfr/Notice';

import { Lauréat } from '@potentiel-domain/projet';

import { getTypeReprésentantLégalLabel } from '../getTypeReprésentantLégalLabel';

import { TypeSociété } from './SaisieTypeSociété.step';

type ValidationStepProps = {
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété?: TypeSociété;
  nomReprésentantLégal: string;
  piècesJustificatives: ReadonlyArray<string>;
  message: string;
  raison?: string;
};
export const ValidationStep: FC<ValidationStepProps> = ({
  typeReprésentantLégal,
  typeSociété,
  nomReprésentantLégal,
  piècesJustificatives,
  message,
  raison,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <Notice title={''} description={<span>{message}</span>} />
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
          {raison && (
            <div className="flex gap-2">
              <div className="font-semibold whitespace-nowrap">Raison :</div>
              <blockquote>{raison}</blockquote>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
