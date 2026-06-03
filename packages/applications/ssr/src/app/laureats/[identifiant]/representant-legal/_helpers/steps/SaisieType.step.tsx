'use client';

import { type FC, useState } from 'react';

import type { Lauréat } from '@potentiel-domain/projet';

import type { ValidationErrors } from '@/utils/formAction';
import type { ModifierReprésentantLégalFormKeys } from '../../modifier/modifierReprésentantLégal.action';
import { TypeReprésentantLégalSelect } from '../TypeReprésentantLégalSelect';
import { SaisieTypeSociétéStep, type TypeSociété } from './SaisieTypeSociété.step';

type Contexte = 'demander' | 'modifier' | 'corriger';

type OnChangeProps = {
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété: TypeSociété;
};

export type SaisieTypeStepProps = {
  contexte: Contexte;
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété: TypeSociété;
  onChange?: ({ typeReprésentantLégal, typeSociété }: OnChangeProps) => void;
  validationErrors: ValidationErrors<ModifierReprésentantLégalFormKeys>;
};

type SaisieTypeState = {
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété: TypeSociété;
};

export const SaisieTypeStep: FC<SaisieTypeStepProps> = ({
  typeReprésentantLégal,
  typeSociété,
  onChange,
  validationErrors,
}) => {
  const [state, setState] = useState<SaisieTypeState>({
    typeReprésentantLégal,
    typeSociété,
  });

  return (
    <>
      <TypeReprésentantLégalSelect
        id="typeReprésentantLégal"
        name="typeRepresentantLegal"
        label="Choisir le type de représentant légal"
        state={validationErrors.typeRepresentantLegal ? 'error' : 'default'}
        stateRelatedMessage="Le type de personne pour le représentant légal est obligatoire"
        typeReprésentantLégalActuel={state.typeReprésentantLégal}
        onTypeReprésentantLégalSelected={(typeReprésentantLégal) => {
          if (onChange) {
            onChange({
              typeReprésentantLégal,
              typeSociété:
                typeReprésentantLégal === 'personne-morale' ? state.typeSociété : 'non renseignée',
            });
          }
          setState((state) => ({ ...state, typeReprésentantLégal }));
        }}
      />
      {typeReprésentantLégal === 'personne-morale' && (
        <SaisieTypeSociétéStep
          onChange={(typeSociété) => {
            if (onChange) {
              onChange({
                typeReprésentantLégal: state.typeReprésentantLégal,
                typeSociété,
              });
            }
            setState({ ...state, typeSociété });
          }}
        />
      )}
      {state.typeSociété === 'non renseignée' && (
        <input type={'hidden'} value={'non renseignée'} name="typeSociete" />
      )}
    </>
  );
};
