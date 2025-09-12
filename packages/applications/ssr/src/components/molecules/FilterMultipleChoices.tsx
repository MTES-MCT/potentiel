'use client';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import { ChangeEvent, FC } from 'react';

type FilterProps = {
  label: string;
  options: Array<{ label: string; value: string }>;
  activeFilters: Array<string>;
  onValueSelected?: (value: Array<string>) => void;
  disabled?: boolean;
};

export const FilterMultipleChoices: FC<FilterProps> = ({
  label,
  options,
  activeFilters,
  disabled,
  onValueSelected,
}) => {
  const handleChange = ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => {
    const newValues = activeFilters.includes(value)
      ? activeFilters.filter((v) => v !== value)
      : [...activeFilters, value];

    if (onValueSelected) {
      onValueSelected(newValues);
    }
  };

  return (
    <Checkbox
      legend={label}
      options={options.map((o) => ({
        label: o.label,
        nativeInputProps: {
          name: o.label,
          value: o.value,
          checked: activeFilters.includes(o.value),
          onChange: handleChange,
        },
      }))}
      disabled={disabled}
    />
  );
};
