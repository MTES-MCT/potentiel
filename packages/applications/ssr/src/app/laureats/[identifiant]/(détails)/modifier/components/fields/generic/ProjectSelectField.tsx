'use client';

import { InputProps } from '@codegouvfr/react-dsfr/Input';
import { useState } from 'react';
import Select, { SelectProps } from '@codegouvfr/react-dsfr/SelectNext';

import {
  ModifierLauréatChampsSupplémentairesValueFormEntries,
  ModifierLauréatValueFormEntries,
} from '@/utils/candidature';

import { FieldValidationErrors } from '../../../ModifierLauréat.form';
import { LinkedValuesButton } from '../../LinkedValuesButton';

type ProjectSelectFieldProps<T> = {
  candidature: T;
  lauréat: T;
  options: SelectProps.Option[];
  name:
    | keyof ModifierLauréatValueFormEntries
    | keyof ModifierLauréatChampsSupplémentairesValueFormEntries;
  estEnCoursDeModification?: boolean;
  validationErrors: FieldValidationErrors;
  label: InputProps['label'];
};

export const ProjectSelectField = <T extends string | undefined>({
  candidature,
  lauréat,
  label,
  options,
  name,
  estEnCoursDeModification,
  validationErrors,
}: ProjectSelectFieldProps<T>) => {
  const [linked, setLinked] = useState(candidature === lauréat && !estEnCoursDeModification);
  const [candidatureValue, setCandidatureValue] = useState(candidature);
  const [lauréatValue, setLauréatValue] = useState(lauréat);

  const onButtonClick = () => {
    setLinked((l) => !l);
    setLauréatValue(candidatureValue);
  };

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="flex-1 font-semibold">{label}</div>
      <div className="flex-[2] flex px-2">
        <input
          name={`candidature.${name}`}
          type="hidden"
          value={candidatureValue}
          disabled={candidatureValue === candidature}
        />
        <Select
          className="w-full"
          label=""
          state={validationErrors[`candidature.${name}`] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors[`candidature.${name}`]}
          nativeSelectProps={{
            value: candidatureValue,
            required: true,
            'aria-required': true,
            onChange: (ev) => {
              setCandidatureValue(ev.target.value as T);
              if (linked) {
                setLauréatValue(ev.target.value as T);
              }
            },
          }}
          options={options}
        />
      </div>
      <div className="flex-[2] flex px-2">
        <input
          name={`laureat.${name}`}
          type="hidden"
          value={lauréatValue}
          disabled={lauréatValue === lauréat}
        />
        <Select
          className="w-full "
          style={{ marginBottom: 0 }}
          label=""
          disabled={linked}
          state={validationErrors[`laureat.${name}`] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors[`laureat.${name}`]}
          nativeSelectProps={{
            value: lauréatValue,
            required: true,
            'aria-required': true,
            onChange: (ev) => {
              setLauréatValue(ev.target.value as T);
            },
          }}
          options={options}
        />

        <LinkedValuesButton
          linked={linked}
          estEnCoursDeModification={estEnCoursDeModification}
          onButtonClick={onButtonClick}
          aDéjàEtéModifié={candidature !== lauréat}
        />
      </div>
    </div>
  );
};
