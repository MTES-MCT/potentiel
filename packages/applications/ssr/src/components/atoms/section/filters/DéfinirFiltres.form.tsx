'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import Tag from '@codegouvfr/react-dsfr/Tag';
import Tooltip from '@codegouvfr/react-dsfr/Tooltip';
import { type FC, useState } from 'react';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import type { FiltersType } from '@potentiel-domain/utilisateur';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { MultipleSelect } from '@/components/molecules/MultipleSelect';
import { définirFiltresAction } from './définirFiltres.action';
import { filtersList } from './filtersList';

export type DéfinirFiltresFormProps = {
  userFilters: FiltersType;
};

export const DéfinirFiltresForm: FC<DéfinirFiltresFormProps> = ({ userFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [filters, setFilters] = useState<FiltersType>(
    userFilters ?? {
      technologie: AppelOffre.technologies.map((t) => t),
      cycle: AppelOffre.cycles.map((t) => t),
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
            <div className="flex flex-row gap-4">
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
    kind="hover"
    title="Les filtres seront appliqués sur votre tableau de bord ainsi que les différentes listes de démarches ou de modifications."
  />
);

const TagsList = ({ userFilters }: { userFilters: FiltersType }) => (
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
