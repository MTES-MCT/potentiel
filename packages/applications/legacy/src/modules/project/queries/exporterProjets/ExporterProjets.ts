import { User } from '../../../../entities';
import { FiltreListeProjets } from '../listerProjets';

export const PermissionExporterProjets = {
  nom: 'exporter-projets',
  description: 'Exporter les projets',
};

export type ExporterProjets = (args: { user: User; filtres?: FiltreListeProjets }) => Promise<{
  colonnes: string[];
  données: {
    [key: string]: string | number;
  }[];
}>;
