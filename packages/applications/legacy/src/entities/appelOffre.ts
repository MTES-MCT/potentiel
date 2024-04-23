import { AppelOffre, Periode } from '@potentiel-domain/appel-offre';

export type ProjectAppelOffre = AppelOffre & {
  periode: Periode;
  isSoumisAuxGF: boolean;
};
