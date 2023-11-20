'use client';
import SelectNext from '@codegouvfr/react-dsfr/SelectNext';
import { FC } from 'react';

type FilterProps = {
  label: string;
  options: Array<{ label: string; value: string }>;
  defaultValue: string;
  onValueSelected?: (value: string | undefined) => void;
};
export const Filter: FC<FilterProps> = ({ label, options, defaultValue, onValueSelected }) => (
  <SelectNext
    label={label}
    placeholder={`Filtrer par ${label.toLocaleLowerCase()}`}
    nativeSelectProps={{
      defaultValue,
      onChange: (e) => {
        const value = e.currentTarget.value;
        if (onValueSelected) {
          onValueSelected(value);
        }
      },
    }}
    options={options}
  />
);
