'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { type FC, useState } from 'react';

import { Candidature } from '@potentiel-domain/projet';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { MultipleSelect } from '@/components/molecules/MultipleSelect';
import type { ValidationErrors } from '@/utils/formAction';
import { type DéfinirFiltresFormKeys, définirFiltresAction } from './définirFiltres.action';

type Filter = Record<string, string>;

export type DéfinirFiltresFormProps = {
  userFilters?: Filter;
};

export const DéfinirFiltresForm: FC<DéfinirFiltresFormProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DéfinirFiltresFormKeys>
  >({});
  const [techno, setTechnologie] = useState<string[]>(
    Candidature.TypeTechnologie.types.map((t) => t),
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
      options: Candidature.TypeTechnologie.types.map((techno) => ({
        label: techno,
        value: techno,
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
      />
      {/* Afficher les filtres comme ailleurs dans l'app
      {userFilter?.length > 0 && (
        <ul className="flex flex-row flex-wrap gap-1">
          {tagFilters.map(({ searchParamKey, label, value, affects }) => (
            <li key={`tagFilter-${searchParamKey}-${value}`}>
              <Tag>{label}</Tag>
            </li>
          ))}
          créer un comportement pour la suppression
          {tagFilters?.length > 1 && (
            <li key="tagFilter-delete">
              <DeleteEveryFilterButton onDelete={onDelete} />
            </li>
          )}
        </ul>
      )} */}
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
                  <div key={filter.inputName}>
                    <MultipleSelect
                      key={`filter-${filter.label}`}
                      noSearch
                      noSelectAll
                      label={filter.label}
                      options={filter.options}
                      disabled={false}
                      selected={techno}
                      onChange={(value) => {
                        setTechnologie(value);
                      }}
                    />
                    <input type="hidden" name={filter.inputName} value={techno} />
                  </div>
                ))}
              </div>
            </div>
          ),
        }}
      />
    </>
  );
};
