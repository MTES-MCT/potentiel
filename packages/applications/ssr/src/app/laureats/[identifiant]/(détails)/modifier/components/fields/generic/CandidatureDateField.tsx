'use client';

import Input, { InputProps } from '@codegouvfr/react-dsfr/Input';
import { useState } from 'react';

import { ModifierCandidatureNotifiéeFormEntries } from '@/utils/candidature';

import { FieldValidationErrors } from '../../../ModifierLauréat.form';
import { LinkedValuesButton } from '../../LinkedValuesButton';

export type CandidatureDateFieldProps<T> = {
  candidature: T;
  name: keyof ModifierCandidatureNotifiéeFormEntries;
  validationErrors: FieldValidationErrors;
  label: InputProps['label'];
  required?: boolean;
};

const formatDateForInput = (date: string | undefined): string => (date ? date.split('T')[0] : '');

export const CandidatureDateField = <T extends string>({
  candidature,
  label,
  name,
  validationErrors,
  required,
}: CandidatureDateFieldProps<T>) => {
  const [candidatureValue, setCandidatureValue] = useState<string>(formatDateForInput(candidature));
  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="flex-1 font-semibold">{required ? label : `${label} (optionnel)`}</div>
      <div className="flex-[2] flex px-2">
        <input
          name={`candidature.${name}`}
          type="hidden"
          value={candidatureValue}
          disabled={new Date(candidatureValue).getTime() === new Date(candidature).getTime()}
        />
        <Input
          className="w-full"
          label=""
          state={validationErrors[`candidature.${name}`] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors[`candidature.${name}`]}
          nativeInputProps={{
            type: 'date',
            value: candidatureValue,
            onChange: (ev) => {
              setCandidatureValue(ev.target.value);
            },
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
            type: 'date',
            value: candidatureValue,
          }}
          addon={<LinkedValuesButton isLocked />}
        />
      </div>
    </div>
  );
};
