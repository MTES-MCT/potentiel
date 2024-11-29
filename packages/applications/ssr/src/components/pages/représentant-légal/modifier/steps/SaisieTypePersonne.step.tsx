'use client';

import { FC, useState } from 'react';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { ValidationErrors } from '@/utils/formAction';

import { ModifierReprésentantLégalFormKeys } from '../modifierReprésentantLégal.action';
import { TypeReprésentantLégalSelect } from '../../TypeReprésentantLégalSelect';

import { getInfosBasedOnTypeReprésentant } from './_utils/getInfosBasedOnTypeReprésentant';

export type SaisieTypePersonneStepProps = {
  typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.RawType;
  onChange?: (nouveauType: ReprésentantLégal.TypeReprésentantLégal.RawType) => void;
  validationErrors: ValidationErrors<ModifierReprésentantLégalFormKeys>;
};

export const SaisieTypePersonneStep: FC<SaisieTypePersonneStepProps> = ({
  typeReprésentantLégal,
  onChange,
  validationErrors,
}) => {
  const [selectedTypePersonne, setSelectedTypePersonne] = useState(typeReprésentantLégal);

  const { component } = getInfosBasedOnTypeReprésentant(selectedTypePersonne);

  return (
    <div className="flex flex-col gap-4">
      <p>
        Pour effectuer une modification du représentant légal vous devez tout d'abord sélectionner
        le type du nouveau représentant légal pour connaître les documents obligatoires nécessaires
        à la modification.
      </p>
      <TypeReprésentantLégalSelect
        id="typeReprésentantLégal"
        name="typeRepresentantLegal"
        label="Choisir le type de représentant légal"
        state={validationErrors.typeRepresentantLegal ? 'error' : 'default'}
        stateRelatedMessage="Le type de personne pour le représentant légal est obligatoire"
        typeReprésentantLégalActuel={selectedTypePersonne}
        onTypeReprésentantLégalSelected={(type) => {
          delete validationErrors.typeRepresentantLegal;
          setSelectedTypePersonne(type);
          onChange && onChange(type);
        }}
      />
      {component}
    </div>
  );
};
