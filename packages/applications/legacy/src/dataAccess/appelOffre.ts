import { GetPeriodeTitle } from '../modules/appelOffre';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export type AppelOffreRepo = {
  findAll: () => Promise<AppelOffre.AppelOffreReadModel[]>;
  findById: (
    id: AppelOffre.AppelOffreReadModel['id'],
  ) => Promise<AppelOffre.AppelOffreReadModel | undefined>;
  getPeriodeTitle: GetPeriodeTitle;
};
