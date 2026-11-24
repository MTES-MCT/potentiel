'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import Tag from '@codegouvfr/react-dsfr/Tag';
import { type FC, useState } from 'react';

import { Candidature } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { MultipleSelect } from '@/components/molecules/MultipleSelect';
import type { ValidationErrors } from '@/utils/formAction';
import { type DéfinirFiltresFormKeys, définirFiltresAction } from './définirFiltres.action';

export type DéfinirFiltresFormProps = {
  userFilters?: Utilisateur.Filters;
};

export const DéfinirFiltresForm: FC<DéfinirFiltresFormProps> = ({ userFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DéfinirFiltresFormKeys>
  >({});
  const [techno, setTechnologie] = useState<string[]>(
    userFilters?.technologie || Candidature.TypeTechnologie.types.map((t) => t),
  );

  // Département
  // technologie
  // Afficher les filtres comme sur les demandes

  // type
  // const filters: ListFilterItem<SearchParams>[] = [
  // ];
  const filters = [
    {
      label: 'Technologie',
      inputName: 'technologie',
      options: Candidature.TypeTechnologie.types.map((technologie) => ({
        label: technologie,
        value: technologie,
      })),
    },
  ];

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
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          children: (
            <div className="h-[200px]">
              <div className="flex flex-col gap-5">
                {filters.map((filter) => (
                  <MultipleSelect
                    key={`filter-${filter.label}`}
                    noSelectAll
                    noSearch
                    label={filter.label}
                    options={filter.options}
                    disabled={false}
                    selected={techno}
                    onChange={(value) => {
                      setTechnologie(value);
                    }}
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
