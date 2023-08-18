import { AppelOffre, Periode, Famille } from '@potentiel/domain-views';

export type ProjectAppelOffre = AppelOffre & {
  periode: Periode;
  famille: Famille | undefined;
  isSoumisAuxGF: boolean;
};
