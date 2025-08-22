'use client';
import { FC } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { ValidationErrors } from '@/utils/formAction';

import { DemanderOuEnregistrerChangementReprésentantLégalFormKeys } from '../schema';

export type SaisieNomProps = {
  nomReprésentantLégal: string;
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  onChange?: (nouveauNom: string) => void;
  validationErrors: ValidationErrors<DemanderOuEnregistrerChangementReprésentantLégalFormKeys>;
};

export const SaisieNomStep: FC<SaisieNomProps> = ({
  nomReprésentantLégal,
  typeReprésentantLégal,
  validationErrors,
  onChange,
}) => {
  const { label, hintText } = match(typeReprésentantLégal)
    .returnType<{ label: string; hintText: string }>()
    .with('personne-physique', () => ({
      label: 'Les nom et prénom(s) de la personne physique',
      hintText: 'les nom et prénom(s)',
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
    .with('inconnu', () => ({
      label: 'Le nom',
      hintText: 'le nom',
    }))
    .exhaustive();

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
          if (onChange) {
            onChange(value);
          }
        },
      }}
      state={validationErrors['nomRepresentantLegal'] ? 'error' : 'default'}
      stateRelatedMessage={validationErrors['nomRepresentantLegal']}
    />
  );
};
