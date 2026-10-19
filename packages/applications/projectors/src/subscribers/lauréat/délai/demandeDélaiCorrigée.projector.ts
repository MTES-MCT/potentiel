import type { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

// voir si ça marche ??
export const demandeDélaiCorrigéeProjector = async ({
  payload: { identifiantProjet, dateDemande, raison, nombreDeMois, pièceJustificative },
}: Lauréat.Délai.DemandeDélaiCorrigéeEvent) => {
  await updateOneProjection<Lauréat.Délai.DemandeDélaiEntity>(
    `demande-délai|${identifiantProjet}#${dateDemande}`,
    {
      demande: {
        nombreDeMois,
        raison,
        ...(pièceJustificative && {
          pièceJustificative: { format: pièceJustificative.format },
        }),
      },
    },
  );
};
