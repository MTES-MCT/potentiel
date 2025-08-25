'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import { useState } from 'react';

import { FieldValidationErrors } from '../../ModifierLauréat.form';
import { LinkedValuesButton } from '../LinkedValuesButton';

export type DateDAutorisationDUrbanismeFieldProps = {
  value: string;
  validationErrors: FieldValidationErrors;
};

const formatDateForInput = (date: string | undefined): string => (date ? date.split('T')[0] : '');

export const DateDAutorisationDUrbanismeField = ({
  value,
  validationErrors,
}: DateDAutorisationDUrbanismeFieldProps) => {
  const [candidatureValue, setCandidatureValue] = useState<string>(formatDateForInput(value));
  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="flex-1 font-semibold">Date d'obtention de l'autorisation d'urbanisme</div>
      <div className="flex-[2] flex px-2">
        <input
          name="candidature.dateDAutorisationDUrbanisme"
          type="hidden"
          value={candidatureValue}
          disabled={candidatureValue === value}
        />
        <Input
          className="w-full"
          label=""
          state={validationErrors[`candidature.dateDAutorisationDUrbanisme`] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors[`candidature.dateDAutorisationDUrbanisme`]}
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
          state={validationErrors[`candidature.dateDAutorisationDUrbanisme`] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors[`candidature.dateDAutorisationDUrbanisme`]}
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
