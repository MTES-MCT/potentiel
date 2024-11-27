'use client';
import { FC } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { ValidationErrors } from '@/utils/formAction';

import { ModifierReprésentantLégalFormKeys } from '../modifierReprésentantLégal.action';

import { getInfosBasedOnTypeReprésentant } from './_utils/getInfosBasedOnTypeReprésentant';

export type SaisieNomReprésentantLégalStepProps = {
  nomReprésentantLégal: string;
  typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.RawType;
  onChange?: (nouveauNom: string) => void;
  validationErrors: ValidationErrors<ModifierReprésentantLégalFormKeys>;
};

export const SaisieNomReprésentantLégalStep: FC<SaisieNomReprésentantLégalStepProps> = ({
  nomReprésentantLégal,
  typeReprésentantLégal,
  validationErrors,
  onChange,
}) => {
  const {
    input: { label, hintText },
  } = getInfosBasedOnTypeReprésentant(typeReprésentantLégal);
  return (
    <Input
      label={label}
      id="nomRepresentantLegal"
      hintText={`Veuillez préciser ${hintText} pour le nouveau représentant légal du projet`}
      nativeInputProps={{
        name: 'nomRepresentantLegal',
        defaultValue: nomReprésentantLégal,
        onChange: ({ target: { value } }) => {
          delete validationErrors.nomRepresentantLegal;
          onChange && onChange(value);
        },
      }}
      state={validationErrors['nomRepresentantLegal'] ? 'error' : 'default'}
      stateRelatedMessage={validationErrors['nomRepresentantLegal']}
    />
  );
};
