'use client';
import Button from '@codegouvfr/react-dsfr/Button';
import SelectNext, { SelectProps } from '@codegouvfr/react-dsfr/SelectNext';
import { FC } from 'react';

type FilterProps = {
  label: string;
  options: SelectProps.Option[];
  value: string;
  onChange?: (value: string | undefined) => void;
  disabled?: boolean;
  canUnselect?: boolean;
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
  canUnselect,
}) => {
  const filter = (
    <SelectNext
      label={title ?? label}
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
      className={className}
    />
  );

  if (canUnselect) {
    return (
      <div className="flex flex-row gap-5 flex-1 w-full">
        {filter}
        {value ? (
          <Button
            className="whitespace-nowrap mb-5 flex-1"
            priority="tertiary no outline"
            size="small"
            onClick={() => {
              if (onChange) {
                onChange(undefined);
              }
            }}
          >
            Retirer le filtre
          </Button>
        ) : null}
      </div>
    );
  }

  return filter;
};
