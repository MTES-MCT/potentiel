'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import Tag from '@codegouvfr/react-dsfr/Tag';
import Tooltip from '@codegouvfr/react-dsfr/Tooltip';
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
      {userFilters && <TagsList userFilters={userFilters} />}
      <ModalWithForm
        id="définir-filtres-form"
        title=""
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          omitMandatoryFieldsLegend: true,
          heading: (
            <div>
              <span>Définir mes filtres</span>
              <FiltresTooltip />
            </div>
          ),
          submitLabel: 'Confirmer',
          action: définirFiltresAction,
          children: (
            <div className="flex flex-col gap-2">
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
          ),
        }}
      />
    </>
  );
};

const FiltresTooltip = () => (
  <Tooltip
    kind="click"
    title="Les filtres seront appliqués sur votre tableau de bord ainsi que les différentes listes de démarches ou de modifications."
  />
);

const TagsList = ({ userFilters }: { userFilters: Filtres.Type }) => (
  <ul className="flex flex-row flex-wrap gap-1">
    {Object.entries(userFilters).map(([key, values]) =>
      values.map((value) => (
        <li key={`tagFilter-${key}-${value}`}>
          <Tag>
            {key} : {value}
          </Tag>
        </li>
      )),
    )}
  </ul>
);
