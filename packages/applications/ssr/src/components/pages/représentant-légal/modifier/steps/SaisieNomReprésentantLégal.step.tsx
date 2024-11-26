'use client';
import { FC } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import { match } from 'ts-pattern';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { ValidationErrors } from '@/utils/formAction';

import { ModifierReprésentantLégalFormKeys } from '../modifierReprésentantLégal.action';

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
  const { label, hintText } = match(typeReprésentantLégal)
    .with('personne-physique', () => ({
      label: 'Les noms et prénoms de la personne physique',
      hintText: 'les nom et prénoms',
    }))
    .with('personne-morale', () => ({
      label: 'Le nom de la société',
      hintText: 'le nom de la société',
    }))
    .with('collectivité', () => ({
      label: 'Le nom de la collectivité',
      hintText: 'le nom de la collectivité',
    }))
    .with('autre', () => ({
      label: `Le nom de l'organisme`,
      hintText: `le nom de l'organisme`,
    }))
    .otherwise(() => ({
      label: 'Le nom',
      hintText: 'le nom',
    }));

  return (
    <>
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
    </>
  );
};
