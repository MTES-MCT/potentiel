import { Lauréat } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const historiqueGarantiesFinancièresEffacéProjector = async ({
  payload: { identifiantProjet, effacéLe },
}: Lauréat.GarantiesFinancières.HistoriqueGarantiesFinancièresEffacéEvent) => {
  const entityToUpsert =
    await findProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet}`,
    );

  if (Option.isNone(entityToUpsert)) {
    throw new Error('Pas de garanties financières à effacer');
  }

  const archives: Lauréat.GarantiesFinancières.ArchiveGarantiesFinancières[] =
    entityToUpsert.actuelles
      ? [
          ...entityToUpsert.archives,
          {
            garantiesFinancières:
              Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType(
                entityToUpsert.actuelles,
              ).formatter(),
            motifArchivage: 'changement de producteur',
            validéLe: entityToUpsert.actuelles.validéLe,
          },
        ]
      : entityToUpsert.archives;

  await upsertProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      identifiantProjet,
      actuelles: undefined,
      dépôt: undefined,
      archives,
      statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.nonDéposé.statut,
      dernièreMiseÀJour: {
        date: effacéLe,
        par: undefined,
      },
    },
  );
};
