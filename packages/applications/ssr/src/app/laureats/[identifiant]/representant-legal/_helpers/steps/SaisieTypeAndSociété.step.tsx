'use client';

import Notice from '@codegouvfr/react-dsfr/Notice';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import type { FC } from 'react';

import type { Lauréat } from '@potentiel-domain/projet';

import type { ValidationErrors } from '@/utils/formAction';
import type { ModifierReprésentantLégalFormKeys } from '../../modifier/modifierReprésentantLégal.action';
import { getPiècesJustificativesText } from '../getTypeReprésentantLégalLabel';
import { TypeReprésentantLégalSelect } from '../TypeReprésentantLégalSelect';

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
  onChange: ({ typeReprésentantLégal, typeSociété }: OnChangeProps) => void;
  validationErrors: ValidationErrors<ModifierReprésentantLégalFormKeys>;
};

export const SaisieTypeAndSociétéStep: FC<SaisieTypeAndSociétéStepProps> = ({
  estUneModificationAdmin,
  typeReprésentantLégal,
  typeSociété,
  onChange,
  validationErrors,
}) => {
  const wordingInfosPiècesJustificatives = estUneModificationAdmin
    ? `Pièces justificatives à avoir en votre possession (vous n'aurez pas à les téléverser sur Potentiel) : ${getPiècesJustificativesText(typeReprésentantLégal, typeSociété)}`
    : '';

  return (
    <div className="flex flex-col gap-2">
      <TypeReprésentantLégalSelect
        id="typeReprésentantLégal"
        name="typeRepresentantLegal"
        label="Choisir le type de représentant légal"
        state={validationErrors.typeRepresentantLegal ? 'error' : 'default'}
        stateRelatedMessage="Le type de personne pour le représentant légal est obligatoire"
        typeReprésentantLégalActuel={typeReprésentantLégal}
        onTypeReprésentantLégalSelected={(typeReprésentantLégal) => {
          onChange({
            typeReprésentantLégal,
            typeSociété:
              typeReprésentantLégal === 'personne-morale' ? typeSociété : 'non renseignée',
          });
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
              onChange({
                typeReprésentantLégal,
                typeSociété:
                  typeReprésentantLégal === 'personne-morale'
                    ? (e.currentTarget.value as TypeSociété)
                    : 'non renseignée',
              });
            },
          }}
          className="lg:w-1/2"
          placeholder="Sélectionnez le type de société"
          options={typesSociétéOptions}
        />
      )}
      {wordingInfosPiècesJustificatives && (
        <Notice title="" description={wordingInfosPiècesJustificatives} />
      )}
      {typeSociété === 'non renseignée' && (
        <input type={'hidden'} value={'non renseignée'} name="typeSociete" />
      )}
    </div>
  );
};
