'use client';
import SelectNext, { SelectProps } from '@codegouvfr/react-dsfr/SelectNext';
import { FC } from 'react';

type FilterProps = {
  label: string;
  options: SelectProps.Option[];
  value: string;
  onChange?: (value: string | undefined) => void;
  disabled?: boolean;
};

export const Filter: FC<FilterProps> = ({ label, options, value, disabled, onChange }) => (
  <SelectNext
    label={label}
    placeholder={`Filtrer par ${label.toLocaleLowerCase()}`}
    nativeSelectProps={{
      value,
      onChange: (e) => {
        const value = e.currentTarget.value;
        if (onChange) {
          onChange(value);
        }
      },
    }}
    options={options}
    disabled={disabled}
  />
);
