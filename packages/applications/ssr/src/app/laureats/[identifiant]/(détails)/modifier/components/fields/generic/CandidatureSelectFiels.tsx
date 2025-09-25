'use client';

import Input, { InputProps } from '@codegouvfr/react-dsfr/Input';
import { useState } from 'react';
import Select, { SelectProps } from '@codegouvfr/react-dsfr/SelectNext';

import { ModifierCandidatureNotifiéeFormEntries } from '@/utils/candidature';

import { FieldValidationErrors } from '../../../ModifierLauréat.form';
import { LinkedValuesButton } from '../../LinkedValuesButton';

type CandidatureSelectFieldProps<T> = {
  candidature: T;
  options: SelectProps.Option[];
  name: keyof ModifierCandidatureNotifiéeFormEntries;
  validationErrors: FieldValidationErrors;
  label: InputProps['label'];
  optionnel?: boolean;
};

export const CandidatureSelectField = <T extends string | number>({
  candidature,
  options,
  label,
  name,
  validationErrors,
  optionnel,
}: CandidatureSelectFieldProps<T>) => {
  const [candidatureValue, setCandidatureValue] = useState(candidature);
  const candidatureLabel = String(
    options.find((option) => option.value === candidatureValue)?.label,
  );

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
        <Select
          className="w-full"
          label=""
          state={validationErrors[`candidature.${name}`] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors[`candidature.${name}`]}
          nativeSelectProps={{
            defaultValue: candidature,
            onChange: (ev) => {
              setCandidatureValue(ev.target.value as T);
            },
          }}
          options={options}
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
            value: candidatureLabel,
          }}
          addon={<LinkedValuesButton isLocked />}
        />
      </div>
    </div>
  );
};
