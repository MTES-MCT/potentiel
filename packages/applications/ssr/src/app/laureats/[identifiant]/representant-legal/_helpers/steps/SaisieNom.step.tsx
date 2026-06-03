'use client';
import Input from '@codegouvfr/react-dsfr/Input';
import type { FC } from 'react';
import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

import type { ValidationErrors } from '@/utils/formAction';
import type { DemanderOuEnregistrerChangementReprésentantLégalFormKeys } from '../schema';

export type SaisieNomProps = {
  nomReprésentantLégal: string;
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  validationErrors: ValidationErrors<DemanderOuEnregistrerChangementReprésentantLégalFormKeys>;
};

export const SaisieNomStep: FC<SaisieNomProps> = ({
  nomReprésentantLégal,
  typeReprésentantLégal,
  validationErrors,
}) => {
  const label = match(typeReprésentantLégal)
    .returnType<string>()
    .with('personne-physique', () => 'Les nom et prénom(s) de la personne physique')
    .with('personne-morale', () => 'Le nom de la société')
    .with('collectivité', () => 'Le nom de la collectivité')
    .with('autre', () => `Le nom de l'organisme`)
    .with('inconnu', () => 'Le nom du nouveau représentant légal')
    .exhaustive();

  return (
    <Input
      label={label}
      id="nomRepresentantLegal"
      className="w-fit"
      nativeInputProps={{
        name: 'nomRepresentantLegal',
        defaultValue: nomReprésentantLégal,
      }}
      state={validationErrors['nomRepresentantLegal'] ? 'error' : 'default'}
      stateRelatedMessage={validationErrors['nomRepresentantLegal']}
    />
  );
};
