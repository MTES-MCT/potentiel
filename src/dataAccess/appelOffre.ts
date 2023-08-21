import { GetPeriodeTitle, GetFamille } from '../modules/appelOffre';
import { AppelOffre } from '@potentiel/domain-views';

export type AppelOffreRepo = {
  findAll: () => Promise<AppelOffre[]>;
  findById: (id: AppelOffre['id']) => Promise<AppelOffre | undefined>;
  getFamille: GetFamille;
  getPeriodeTitle: GetPeriodeTitle;
};
