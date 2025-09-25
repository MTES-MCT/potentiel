'use client';

import Input, { InputProps } from '@codegouvfr/react-dsfr/Input';
import { useState } from 'react';

import { ModifierCandidatureNotifiéeFormEntries } from '@/utils/candidature';

import { FieldValidationErrors } from '../../../ModifierLauréat.form';
import { LinkedValuesButton } from '../../LinkedValuesButton';
import { getInputTypeNativeProps } from '../../../_helpers/getInputTypeNativeProps';

export type CandidatureFieldProps<T> = {
  candidature: T;
  name: keyof ModifierCandidatureNotifiéeFormEntries;
  validationErrors: FieldValidationErrors;
  label: InputProps['label'];
  optionnel?: boolean;
};

export const CandidatureField = <T extends string | number>({
  candidature,
  label,
  name,
  validationErrors,
  optionnel,
}: CandidatureFieldProps<T>) => {
  const [candidatureValue, setCandidatureValue] = useState(candidature);

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="flex-1 font-semibold">{optionnel ? `${label} (optionnel)` : label}</div>
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
            value: candidatureValue,
            onChange: (ev) => {
              setCandidatureValue(ev.target.value as T);
            },
            ...getInputTypeNativeProps(candidature),
          }}
        />
      </div>
      <div className="flex-[2] flex px-2">
        <Input
          className="w-full"
          disabled
          label=""
          state={validationErrors[`candidature.${name}`] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors[`candidature.${name}`]}
          nativeInputProps={{
            value: candidatureValue,
            ...getInputTypeNativeProps(candidature),
          }}
          addon={<LinkedValuesButton isLocked />}
        />
      </div>
    </div>
  );
};
