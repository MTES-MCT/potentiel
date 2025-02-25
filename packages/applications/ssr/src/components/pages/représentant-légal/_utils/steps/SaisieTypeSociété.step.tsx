'use client';

import { FC } from 'react';
import { match, P } from 'ts-pattern';
import Select from '@codegouvfr/react-dsfr/SelectNext';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { ValidationErrors } from '@/utils/formAction';

import { DemanderChangementReprésentantLégalFormKeys } from '../../changement/demander/demanderChangementReprésentantLégal.action';

export type TypeSociété = 'société constituée' | 'société en cours de constitution';

export type SaisieTypeSociétéProps = {
  typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.RawType;
  onChange: (nouveauNom: string) => void;
  validationErrors: ValidationErrors<DemanderChangementReprésentantLégalFormKeys>;
};

export const SaisieTypeSociétéStep: FC<SaisieTypeSociétéProps> = ({
  typeReprésentantLégal,
  validationErrors,
  onChange,
}) => {
  return match(typeReprésentantLégal)
    .with('personne-morale', () => (
      <Select
        id="typeSociete"
        label="Type de société"
        nativeSelectProps={{
          name: 'typeSociete',
          required: true,
          'aria-required': true,
          onChange: (e) => onChange(e.currentTarget.value),
        }}
        placeholder="Sélectionnez le type du société légal"
        options={[
          {
            label: 'Société constituée'
              .with('personne-physique', () => 'Personne physique')
              .with('personne-morale', () => 'Personne morale')
              .with('collectivité', () => 'Collectivité')
              .with('autre', () => 'Autre')
              .exhaustive(),
            value: 'societe-constituee',
            key: type,
          },
        ]}
        state={validationErrors['typeSociete'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['typeSociete']}
      />
    ))
    .otherwise(() => null);
};
