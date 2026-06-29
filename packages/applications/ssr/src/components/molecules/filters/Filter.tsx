import SelectNext, { type SelectProps } from '@codegouvfr/react-dsfr/SelectNext';
import type { FC } from 'react';

export type FilterProps = {
  label: string;
  options: SelectProps.Option[];
  value: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  title?: string;
  className?: string;
};

export const Filter: FC<FilterProps> = ({
  label,
  options,
  value,
  disabled,
  onChange,
  title,
  className,
}) => (
  <SelectNext
    label={title ?? label}
    placeholder={`Filtrer par ${label.toLocaleLowerCase()}`}
    nativeSelectProps={{
      value,
      onChange: (e) => {
        const value = e.currentTarget.value;
        onChange(value);
      },
    }}
    options={options}
    disabled={disabled}
    className={className}
  />
);
