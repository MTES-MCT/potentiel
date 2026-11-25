import { Filtres } from '@potentiel-domain/utilisateur';

import type { DéfinirFiltresFormKeys } from './définirFiltres.action';

export type ListFilterItem<T = string> = {
  inputName: T;
  label: string;
  options: Array<{
    label: string;
    value: string;
  }>;
};

export const filtersList: ListFilterItem<DéfinirFiltresFormKeys>[] = [
  {
    label: 'Technologie',
    inputName: 'technologie',
    options: Filtres.technologie.map((t) => ({
      label: t,
      value: t,
    })),
  },
  {
    label: 'Cycle',
    inputName: 'cycle',
    options: Filtres.cycle.map((c) => ({
      label: c,
      value: c,
    })),
  },
];
