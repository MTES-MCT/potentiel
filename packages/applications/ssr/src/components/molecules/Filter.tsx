'use client';
import SelectNext from '@codegouvfr/react-dsfr/SelectNext';
import { FC } from 'react';

type FilterProps = {
  label: string;
  options: Array<{ label: string; value: string }>;
  value: string;
  onValueSelected?: (value: string | undefined) => void;
  disabled?: boolean;
};

export const Filter: FC<FilterProps> = ({ label, options, value, disabled, onValueSelected }) => (
  <SelectNext
    label={label}
    placeholder={`Filtrer par ${label.toLocaleLowerCase()}`}
    nativeSelectProps={{
      value,
      onChange: (e) => {
        const value = e.currentTarget.value;
        if (onValueSelected) {
          onValueSelected(value);
        }
      },
    }}
    options={options}
    disabled={disabled}
  />
);
