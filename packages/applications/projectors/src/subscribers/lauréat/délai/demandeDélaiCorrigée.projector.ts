import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const demandeDélaiCorrigéeProjector = async ({
  payload: { identifiantProjet, dateDemande, raison, nombreDeMois, pièceJustificative },
}: Lauréat.Délai.DemandeDélaiCorrigéeEvent) => {
  await updateOneProjection<Lauréat.Délai.DemandeDélaiEntity>(
    `demande-délai|${identifiantProjet}#${dateDemande}`,
    {
      nombreDeMois,
      raison,
      ...(pièceJustificative && {
        pièceJustificative: { format: pièceJustificative.format },
      }),
    },
  );
};
