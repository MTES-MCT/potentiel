'use client';
import { FC } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import { match } from 'ts-pattern';

import { ValidationErrors } from '@/utils/formAction';

import { ReprésentantLégal } from '../ModifierReprésentantLégal.form';
import { ModifierReprésentantLégalFormKeys } from '../modifierReprésentantLégal.action';

export type SaisieCorrectionReprésentantLégalStepProps = {
  représentantLégalExistant: ReprésentantLégal;
  onChange?: (nouveauReprésentantLégal: ReprésentantLégal) => void;
  validationErrors: ValidationErrors<ModifierReprésentantLégalFormKeys>;
};

export const SaisieCorrectionReprésentantLégalStep: FC<
  SaisieCorrectionReprésentantLégalStepProps
> = ({ représentantLégalExistant, validationErrors, onChange }) => {
  const getWordingBasedOnTypePersonne = match(représentantLégalExistant.typePersonne)
    .with('Personne physique', () => ({
      label: 'Les noms et prénoms de la personne physique',
      hintText: 'les nom et prénom',
    }))
    .with('Personne morale', () => ({
      label: 'Le nom de la société',
      hintText: 'le nom de la société',
    }))
    .with('Collectivité', () => ({
      label: 'Le nom de la collectivité',
      hintText: 'le nom de la collectivité',
    }))
    .with('Autre', () => ({
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
        label={getWordingBasedOnTypePersonne.label}
        id="nomRepresentantLegal"
        hintText={`Veuillez préciser ${getWordingBasedOnTypePersonne.hintText} pour le nouveau représentant légal du projet`}
        nativeInputProps={{
          name: 'nomRepresentantLegal',
          defaultValue: représentantLégalExistant.nomReprésentantLégal,
          onChange: (e) => {
            delete validationErrors.nomRepresentantLegal;
            onChange &&
              onChange({
                typePersonne: représentantLégalExistant.typePersonne,
                nomReprésentantLégal: e.target.value,
              });
          },
        }}
        state={validationErrors['nomRepresentantLegal'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['nomRepresentantLegal']}
      />
    </>
  );
};
