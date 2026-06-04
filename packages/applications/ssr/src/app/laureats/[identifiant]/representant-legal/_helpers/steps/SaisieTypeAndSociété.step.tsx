'use client';

import Select from '@codegouvfr/react-dsfr/SelectNext';
import { type FC, useState } from 'react';

import type { Lauréat } from '@potentiel-domain/projet';

import type { ValidationErrors } from '@/utils/formAction';
import type { ModifierReprésentantLégalFormKeys } from '../../modifier/modifierReprésentantLégal.action';
import { getPiècesJustificativesText } from '../getTypeReprésentantLégalLabel';
import { TypeReprésentantLégalSelect } from '../TypeReprésentantLégalSelect';

type Contexte = 'demander' | 'modifier' | 'corriger';

type OnChangeProps = {
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété: TypeSociété;
};

export type TypeSociété = 'constituée' | 'en cours de constitution' | 'non renseignée';

const typesSociétéOptions = [
  {
    label: 'Société constituée',
    value: 'constituée',
    key: 'constituée',
  },
  {
    label: 'Société en cours de constitution',
    value: 'en cours de constitution',
    key: 'en cours de constitution',
  },
];

export type SaisieTypeAndSociétéStepProps = {
  estUneModificationAdmin?: true;
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété: TypeSociété;
  onChange?: ({ typeReprésentantLégal, typeSociété }: OnChangeProps) => void;
  validationErrors: ValidationErrors<ModifierReprésentantLégalFormKeys>;
};

type SaisieTypeState = {
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété: TypeSociété;
};

export const SaisieTypeAndSociétéStep: FC<SaisieTypeAndSociétéStepProps> = ({
  estUneModificationAdmin,
  typeReprésentantLégal,
  typeSociété,
  onChange,
  validationErrors,
}) => {
  const [state, setState] = useState<SaisieTypeState>({
    typeReprésentantLégal,
    typeSociété,
  });

  const wordingInfosPiècesJustificatives = estUneModificationAdmin
    ? `Pièces à avoir en votre possession (vous n'aurez pas à les téléverser sur Potentiel) : ${getPiècesJustificativesText(state.typeReprésentantLégal, state.typeSociété)}`
    : '';

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
        <Select
          id="typeSociete"
          label="Choisir le type de société"
          nativeSelectProps={{
            name: 'typeSociete',
            required: true,
            'aria-required': true,
            onChange: (e) => {
              setState({ ...state, typeSociété: e.currentTarget.value as TypeSociété });
            },
          }}
          className="lg:w-1/2"
          placeholder="Sélectionnez le type de société"
          options={typesSociétéOptions}
        />
      )}
      {wordingInfosPiècesJustificatives && (
        <p className="fr-hint-text">{wordingInfosPiècesJustificatives}</p>
      )}
      {state.typeSociété === 'non renseignée' && (
        <input type={'hidden'} value={'non renseignée'} name="typeSociete" />
      )}
    </>
  );
};
