import { AppelOffre, Periode, Famille } from '@potentiel-domain/appel-offre';

export type ProjectAppelOffre = AppelOffre & {
  periode: Periode;
  famille: Famille | undefined;
  isSoumisAuxGF: boolean;
};
