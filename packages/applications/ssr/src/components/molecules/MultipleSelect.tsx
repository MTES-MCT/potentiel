'use client';

import { fr } from '@codegouvfr/react-dsfr';
import Input from '@codegouvfr/react-dsfr/Input';
import clsx from 'clsx';
import { useId, useRef, useState } from 'react';

type Option = {
  value: string;
  label: string;
};

export type MultipleSelectProps = Omit<MultipleSelectPopoverProps, 'id'> & {
  id?: string;
  label: string;
  options: Array<Option>;
  disabled: boolean;
  formName?: string;
};

export const MultipleSelect: React.FC<MultipleSelectProps> = ({
  id,
  label,
  options,
  selected,
  noSearch,
  onChange,
  disabled,
  formName,
}) => {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLFieldSetElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverId = useId();

  const closePopover = (refocusButton = false) => {
    setOpen(false);

    if (refocusButton) {
      buttonRef.current?.focus();
    }
  };

  const openPopover = () => {
    setOpen(true);
  };

  const handleBlurCapture = (event: React.FocusEvent<HTMLFieldSetElement>) => {
    const nextFocusedElement = event.relatedTarget;

    if (containerRef.current && nextFocusedElement instanceof Node) {
      if (containerRef.current.contains(nextFocusedElement)) {
        return;
      }
    }

    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFieldSetElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closePopover(true);
    }
  };

  return (
    <fieldset
      ref={containerRef}
      className={clsx(
        'relative mb-6 fr-select--group border-0 p-0 m-0 min-w-0',
        disabled && 'fr-select-group--disabled',
      )}
      onBlurCapture={handleBlurCapture}
      onKeyDown={handleKeyDown}
    >
      <legend className={clsx(fr.cx('fr-label', disabled && 'fr-label--disabled'))}>{label}</legend>
      {disabled ? (
        <select id={id} disabled className="fr-select" defaultValue="">
          <option value="" disabled>
            Sélectionner une option
          </option>
        </select>
      ) : (
        <button
          ref={buttonRef}
          id={id}
          type="button"
          className="fr-select cursor-pointer text-left"
          onClick={() => {
            if (open) {
              closePopover();
              return;
            }

            openPopover();
          }}
          aria-expanded={open}
          aria-controls={open ? popoverId : undefined}
        >
          {selected.length > 0
            ? selected.length === 1
              ? `${selected.length} option sélectionnée`
              : `${selected.length} options sélectionnées`
            : 'Sélectionner une option'}
        </button>
      )}
      {formName &&
        selected.map((value) => <input key={value} type="hidden" name={formName} value={value} />)}
      {open && (
        <MultipleSelectPopover
          id={popoverId}
          options={options}
          selected={selected}
          onChange={onChange}
          noSearch={noSearch}
        />
      )}
    </fieldset>
  );
};

type MultipleSelectPopoverProps = {
  id: string;
  options: Array<Option>;
  selected: string[];
  onChange: (selected: Array<string>) => void;
  noSearch?: true;
};

const MultipleSelectPopover: React.FC<MultipleSelectPopoverProps> = ({
  id,
  options,
  selected,
  onChange,
  noSearch,
}) => {
  const [filterText, setFilterText] = useState<string>('');
  const visibleOptions = filterText
    ? options.filter((o) => o.label.toLowerCase().includes(filterText.toLowerCase()))
    : options;

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      const newSelected = selected.filter((v) => v !== value);
      onChange(newSelected);
      return;
    }

    onChange([...selected, value]);
  };

  return (
    <div
      id={id}
      className="flex flex-col align-center gap-4 fr-mt-1 p-4 shadow-lg rounded-b-sm absolute bg-theme-white z-10 w-full"
      role="presentation"
    >
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
      <ul className="flex flex-col gap-2 m-0 max-h-[430px] overflow-y-auto" tabIndex={-1}>
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
