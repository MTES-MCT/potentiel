'use client';
import Tag from '@codegouvfr/react-dsfr/Tag';
import type { FC } from 'react';

import { Filter, type FilterProps } from '@/components/molecules/filters/Filter';
import { useFilter } from '@/components/molecules/filters/useFilters';

export type CatégorieFilterProps = {
  catégories: FilterProps['options'];
};
export const CatégorieFilter: FC<CatégorieFilterProps> = ({ catégories }) => {
  const searchParamKey = 'categorie';
  const { handleOnChange, searchParams } = useFilter();
  const value = searchParams.get(searchParamKey) ?? '';
  return (
    <div className="flex flex-row gap-5 items-center">
      <Filter
        label="Catégorie"
        title=""
        options={catégories}
        value={value}
        onChange={(value) => handleOnChange({ searchParamKey, value: value ? [value] : [] })}
      />
      {value && (
        <Tag
          iconId="fr-icon-delete-bin-line"
          className="mb-6"
          nativeButtonProps={{
            onClick: () => handleOnChange({ searchParamKey, value: [] }),
          }}
        >
          Effacer le filtre
        </Tag>
      )}
    </div>
  );
};
