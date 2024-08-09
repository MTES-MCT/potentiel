import { AppelOffre } from '@potentiel-domain/appel-offre';

export type ProjectAppelOffre = AppelOffre.AppelOffreReadModel & {
  periode: AppelOffre.Periode;
  isSoumisAuxGF: boolean;
};
