'use client';

import { fr } from '@codegouvfr/react-dsfr';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

type Option = {
  value: string;
  label: string;
};

export type MultipleSelectProps = MultipleSelectPopoverProps & {
  id?: string;
  label: string;
  options: Array<Option>;
  disabled: boolean;
};

export const MultipleSelect: React.FC<MultipleSelectProps> = ({
  id,
  label,
  options,
  selected,
  noSearch,
  noSelectAll,
  onChange,
  disabled,
}) => {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', onClickOutside);
    } else {
      document.removeEventListener('mousedown', onClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={`relative mb-6 fr-select--group ${disabled ? 'fr-select-group--disabled' : ''}`}
    >
      <label htmlFor={id} className={clsx(fr.cx('fr-label', disabled && 'fr-label--disabled'))}>
        {label}
      </label>
      {disabled ? (
        <select disabled className="fr-select">
          <option value="" disabled selected>
            Sélectionner une option
          </option>
        </select>
      ) : (
        <div
          className="fr-select cursor-pointer"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          {selected.length > 0
            ? selected.length === 1
              ? `${selected.length} option sélectionnée`
              : `${selected.length} options sélectionnées`
            : 'Sélectionner une option'}
        </div>
      )}
      {open && (
        <MultipleSelectPopover
          options={options}
          selected={selected}
          onChange={onChange}
          noSearch={noSearch}
          noSelectAll={noSelectAll}
        />
      )}
    </div>
  );
};

type MultipleSelectPopoverProps = {
  options: Array<Option>;
  selected: string[];
  onChange: (selected: Array<string>) => void;
  noSearch?: true;
  noSelectAll?: true;
};

const MultipleSelectPopover: React.FC<MultipleSelectPopoverProps> = ({
  options,
  selected,
  onChange,
  noSearch,
  noSelectAll,
}) => {
  const [filterText, setFilterText] = useState<string>('');
  const visibleOptions = filterText
    ? options.filter((o) => o.label.toLowerCase().includes(filterText.toLowerCase()))
    : options;

  const someVisibleSelected = visibleOptions.some((o) => selected.includes(o.value));

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      const newSelected = selected.filter((v) => v !== value);
      onChange(newSelected);
      return;
    }

    onChange([...selected, value]);
  };

  const toggleSelectAllVisible = () => {
    if (someVisibleSelected) {
      const newSelected = selected.filter((v) => !visibleOptions.some((o) => o.value === v));
      onChange(newSelected);
      return;
    }

    const toAdd = visibleOptions.map((o) => o.value).filter((v) => !selected.includes(v));
    onChange([...selected, ...toAdd]);
  };

  return (
    <div
      className="flex flex-col align-center gap-4 fr-mt-1 p-4 shadow-lg rounded-b-sm absolute bg-theme-white z-10 w-full"
      role="listbox"
    >
      {!noSelectAll && (
        <div className="flex justify-center fr-p-1">
          <Button
            className="fr-btn--tertiary fr-btn"
            onClick={toggleSelectAllVisible}
            iconId={someVisibleSelected ? 'fr-icon-close-circle-line' : 'fr-icon-check-line'}
          >
            {someVisibleSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
          </Button>
        </div>
      )}
      {!noSearch && (
        <div className="fr-p-1">
          <Input
            nativeInputProps={{
              type: 'search',
              placeholder: 'Rechercher...',
              value: filterText,
              onChange: (e) => setFilterText(e.target.value),
            }}
            label=""
          />
        </div>
      )}
      <ul className="flex flex-col gap-2 m-0 max-h-[430px] overflow-y-auto">
        {visibleOptions.length === 0 ? (
          <li className="">Aucun résultat</li>
        ) : (
          visibleOptions.map((o) => (
            <li key={o.value} className="fr-checkbox-group fr-checkbox-group--sm">
              <input
                id={`checkbox-${o.value}`}
                type="checkbox"
                aria-describedby={`checkbox-messages-${o.value}`}
                checked={selected.includes(o.value)}
                onChange={() => toggleOption(o.value)}
              />
              <label className="fr-label" htmlFor={`checkbox-${o.value}`}>
                {o.label}
              </label>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
