import { Lauréat } from '@potentiel-domain/projet';

export const getMotifDemandeDélaiFromLabel = (label: string) =>
  label === "prolongation du délai d'achèvement"
    ? Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement
    : label === "prolongation du délai de phase d'essai"
      ? Lauréat.Délai.MotifDemandeDélai.prolongationPhaseEssai
      : undefined;
