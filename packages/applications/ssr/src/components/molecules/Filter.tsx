'use client';
import SelectNext from '@codegouvfr/react-dsfr/SelectNext';
import { FC, useEffect, useState } from 'react';

type FilterProps = {
  label: string;
  options: Array<{ label: string; value: string }>;
  defaultValue: string;
  onValueSelected?: (value: string | undefined) => void;
};
export const Filter: FC<FilterProps> = ({ label, options, defaultValue, onValueSelected }) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (onValueSelected) {
      onValueSelected(defaultValue);
    }
    setValue(defaultValue);
  }, [defaultValue, onValueSelected, setValue]);

  return (
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
          setValue(value);
        },
      }}
      options={options}
    />
  );
};
