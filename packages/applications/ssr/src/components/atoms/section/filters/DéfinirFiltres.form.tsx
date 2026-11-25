'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import Tag from '@codegouvfr/react-dsfr/Tag';
import { type FC, useState } from 'react';

import { Filtres } from '@potentiel-domain/utilisateur';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { MultipleSelect } from '@/components/molecules/MultipleSelect';
import { définirFiltresAction } from './définirFiltres.action';
import { filtersList } from './filtersList';

export type DéfinirFiltresFormProps = {
  userFilters?: Filtres.Type;
};

export const DéfinirFiltresForm: FC<DéfinirFiltresFormProps> = ({ userFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState<Filtres.Type>(
    userFilters ?? {
      technologie: Filtres.technologie.map((t) => t),
      cycle: Filtres.cycle.map((t) => t),
    },
  );

  return (
    <>
      <Button
        iconId="ri-equalizer-3-fill"
        priority="tertiary no outline"
        title="Définir mes filtres"
        onClick={() => setIsOpen(true)}
        size="small"
      />
      {userFilters && (
        <ul className="flex flex-row flex-wrap gap-1">
          {userFilters.technologie.map((value) => (
            <li key={`tagFilter-${value}`}>
              <Tag>{value}</Tag>
            </li>
          ))}
        </ul>
      )}
      <ModalWithForm
        id="définir-filtres-form"
        title=""
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          omitMandatoryFieldsLegend: true,
          heading: 'Définir mes filtres',
          submitLabel: 'Confirmer',
          action: définirFiltresAction,
          children: (
            <div className="h-[200px]">
              <div className="flex flex-col gap-5">
                {filtersList.map((filter) => (
                  <MultipleSelect
                    key={`filter-${filter.label}`}
                    noSelectAll
                    noSearch
                    label={filter.label}
                    options={filter.options}
                    disabled={false}
                    selected={filters[filter.inputName]}
                    onChange={(value) =>
                      setFilters((f) => ({
                        ...f,
                        [filter.inputName]: value,
                      }))
                    }
                    formName={filter.inputName}
                  />
                ))}
              </div>
            </div>
          ),
        }}
      />
    </>
  );
};
