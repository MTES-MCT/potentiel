import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const délaiAccordéProjector = async ({
  payload: { identifiantProjet, accordéPar, accordéLe, durée, ...payload },
}: Lauréat.Délai.DélaiAccordéEvent) => {
  if (payload.raison === 'demande') {
    await updateOneProjection<Lauréat.Délai.DemandeDélaiEntity>(
      `demande-délai|${identifiantProjet}#${payload.dateDemande}`,
      {
        statut: Lauréat.Délai.StatutDemandeDélai.accordé.statut,
        accord: {
          réponseSignée: { format: payload.réponseSignée.format },
          accordéeLe: accordéLe,
          accordéePar: accordéPar,
          nombreDeMois: durée,
        },
      },
    );
  }
};
