import { GetPeriodeTitle } from '../modules/appelOffre';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export type AppelOffreRepo = {
  findAll: () => Promise<AppelOffre[]>;
  findById: (id: AppelOffre['id']) => Promise<AppelOffre | undefined>;
  getPeriodeTitle: GetPeriodeTitle;
};
