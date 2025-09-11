'use client';

import Input, { InputProps } from '@codegouvfr/react-dsfr/Input';
import { useState } from 'react';

import {
  ModifierLauréatChampsSupplémentairesValueFormEntries,
  ModifierLauréatValueFormEntries,
} from '@/utils/candidature';

import { FieldValidationErrors } from '../../ModifierLauréat.form';
import { LinkedValuesButton } from '../LinkedValuesButton';
import { getInputTypeNativeProps } from '../../_helpers/getInputTypeNativeProps';

type ProjectFieldProps<T> = {
  candidature: T;
  lauréat: T;
  name:
    | keyof ModifierLauréatValueFormEntries
    | keyof ModifierLauréatChampsSupplémentairesValueFormEntries;
  estEnCoursDeModification?: boolean;
  validationErrors: FieldValidationErrors;
  label: InputProps['label'];
  nativeInputProps?: InputProps['nativeInputProps'];
};

export const ProjectField = <T extends string | number | undefined>({
  candidature,
  lauréat,
  label,
  name,
  estEnCoursDeModification,
  nativeInputProps,
  validationErrors,
}: ProjectFieldProps<T>) => {
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
        <Input
          className="w-full"
          label=""
          state={validationErrors[`candidature.${name}`] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors[`candidature.${name}`]}
          nativeInputProps={{
            ...getInputTypeNativeProps(candidature),
            ...nativeInputProps,
            value: candidatureValue,
            onChange: (ev) => {
              setCandidatureValue(ev.target.value as T);
              if (linked) {
                setLauréatValue(ev.target.value as T);
              }
            },
          }}
        />
      </div>
      <div className="flex-[2] flex px-2">
        <input
          name={`laureat.${name}`}
          type="hidden"
          value={lauréatValue}
          disabled={lauréatValue === lauréat}
        />
        <Input
          className="w-full"
          disabled={estEnCoursDeModification || linked}
          label=""
          state={validationErrors[`laureat.${name}`] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors[`laureat.${name}`]}
          nativeInputProps={{
            ...getInputTypeNativeProps(candidature),
            ...nativeInputProps,
            value: lauréatValue,
            onChange: (ev) => {
              setLauréatValue(ev.target.value as T);
              if (linked) {
                setCandidatureValue(ev.target.value as T);
              }
            },
          }}
          addon={
            <LinkedValuesButton
              linked={linked}
              estEnCoursDeModification={estEnCoursDeModification}
              onButtonClick={onButtonClick}
              aDéjàEtéModifié={candidature !== lauréat}
            />
          }
        />
      </div>
    </div>
  );
};
