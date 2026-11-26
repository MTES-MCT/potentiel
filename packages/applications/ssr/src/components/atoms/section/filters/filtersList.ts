import { AppelOffre } from '@potentiel-domain/appel-offre';

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
    options: AppelOffre.technologies.map((t) => ({
      label: t,
      value: t,
    })),
  },
  {
    label: 'Cycle',
    inputName: 'cycle',
    options: AppelOffre.cycles.map((c) => ({
      label: c,
      value: c,
    })),
  },
];
