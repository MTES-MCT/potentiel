'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';
import { useState, useRef, useEffect } from 'react';

type Option = {
  value: string;
  label: string;
};

export type MultipleSelectProps = MultipleSelectPopoverProps & {
  id?: string;
  label: string;
  options: Option[];
};

const MultipleSelect: React.FC<MultipleSelectProps> = ({
  id,
  label,
  options,
  selected,
  noSearch,
  noSelectAll,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
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
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="fr-label ">
        {label}
      </label>
      <div
        className="fr-select cursor-pointer"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected.length > 0
          ? `${selected.length} options sélectionnée(s)`
          : 'Sélectionner une option'}
      </div>
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
  options: Option[];
  selected: string[];
  onChange?: (selected: string[]) => void;
  noSearch?: boolean;
  noSelectAll?: boolean;
};

const MultipleSelectPopover: React.FC<MultipleSelectPopoverProps> = ({
  options,
  selected,
  onChange,
  noSearch,
  noSelectAll,
}) => {
  const [filterText, setFilterText] = useState('');
  const visibleOptions = filterText
    ? options.filter((opt) => opt.label.toLowerCase().includes(filterText.toLowerCase()))
    : options;

  const someVisibleSelected = visibleOptions.some((opt) => selected.includes(opt.value));

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange?.(selected.filter((v) => v !== value));
    } else {
      onChange?.([...selected, value]);
    }
  };

  const toggleSelectAllVisible = () => {
    if (someVisibleSelected) {
      // Deselect all visible
      const newSelected = selected.filter((v) => !visibleOptions.some((opt) => opt.value === v));
      onChange?.(newSelected);
    } else {
      // Add all visible
      const toAdd = visibleOptions.map((opt) => opt.value).filter((v) => !selected.includes(v));
      onChange?.([...selected, ...toAdd]);
    }
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
        <div className=" fr-p-1">
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
      <ul className="flex flex-col gap-2 p-0 m-0" style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {visibleOptions.length === 0 && <li className="">Aucun résultat</li>}
        {visibleOptions.map((opt) => (
          <li key={opt.value} className="fr-checkbox-group">
            <input
              id={`checkbox-${opt.value}`}
              type="checkbox"
              aria-describedby={`checkbox-messages-${opt.value}`}
              checked={selected.includes(opt.value)}
              onChange={() => toggleOption(opt.value)}
            />
            <label className="fr-label" htmlFor={`checkbox-${opt.value}`}>
              {opt.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MultipleSelect;
