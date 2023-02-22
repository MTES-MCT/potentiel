import { ResultAsync } from '@core/utils';
import { User } from '@entities';
import { InfraNotAvailableError } from '@modules/shared';
import { FiltreListeProjets } from '../listerProjets';

export const PermissionExporterProjets = {
  nom: 'exporter-projets',
  description: 'Exporter les projets',
};

export type ExporterProjets = (args: { user: User; filtres?: FiltreListeProjets }) => ResultAsync<
  {
    colonnes: string[];
    données: {
      [key: string]: string | number;
    }[];
  },
  InfraNotAvailableError
>;
