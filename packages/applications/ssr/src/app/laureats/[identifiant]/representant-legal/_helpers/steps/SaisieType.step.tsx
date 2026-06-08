'use client';

import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

import type { Lauréat } from '@potentiel-domain/projet';

import type { ValidationErrors } from '@/utils/formAction';
import type { ModifierReprésentantLégalFormKeys } from '../../modifier/modifierReprésentantLégal.action';
import { getPiècesJustificativesText } from '../getTypeReprésentantLégalLabel';
import { TypeReprésentantLégalSelect } from '../TypeReprésentantLégalSelect';

type OnChangeProps = {
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  estEnCoursDeConstitution: boolean;
};

export type SaisieTypeStepProps = {
  estUneModificationAdmin?: true;
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  estEnCoursDeConstitution: boolean;
  onChange: ({ typeReprésentantLégal, estEnCoursDeConstitution }: OnChangeProps) => void;
  validationErrors: ValidationErrors<ModifierReprésentantLégalFormKeys>;
};

export const SaisieTypeStep: FC<SaisieTypeStepProps> = ({
  estUneModificationAdmin,
  typeReprésentantLégal,
  estEnCoursDeConstitution,
  onChange,
  validationErrors,
}) => {
  const wordingInfosPiècesJustificatives = estUneModificationAdmin
    ? `Pièces justificatives à avoir en votre possession (vous n'aurez pas à les téléverser sur Potentiel) : ${getPiècesJustificativesText(typeReprésentantLégal, estEnCoursDeConstitution)}`
    : `Pièces justificatives à fournir : ${getPiècesJustificativesText(typeReprésentantLégal, estEnCoursDeConstitution)}`;

  return (
    <div className="flex flex-col gap-4">
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
            estEnCoursDeConstitution:
              typeReprésentantLégal === 'personne-morale' ? estEnCoursDeConstitution : false,
          });
        }}
      />
      {typeReprésentantLégal === 'personne-morale' && (
        <Checkbox
          id="typeSociete"
          className="mt-0"
          options={[
            {
              label: 'La société est en cours de constitution',
              nativeInputProps: {
                value: 'true',
                defaultChecked: false,
                onChange: (e) => {
                  onChange({
                    typeReprésentantLégal,
                    estEnCoursDeConstitution: e.currentTarget.checked,
                  });
                },
              },
            },
          ]}
        />
      )}
      {wordingInfosPiècesJustificatives && (
        <Notice title="" className="lg:w-1/2" description={wordingInfosPiècesJustificatives} />
      )}
    </div>
  );
};
