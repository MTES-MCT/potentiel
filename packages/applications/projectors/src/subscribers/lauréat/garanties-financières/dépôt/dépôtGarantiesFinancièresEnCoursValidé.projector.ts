import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';

export const dépôtGarantiesFinancièresEnCoursValidéProjector = async (
  event:
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEventV1
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent,
) => {
  const entityToUpsert =
    await findProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
      `garanties-financieres|${event.payload.identifiantProjet}`,
    );

  const archives: Lauréat.GarantiesFinancières.ArchiveGarantiesFinancières[] = Option.isSome(
    entityToUpsert,
  )
    ? entityToUpsert.actuelles
      ? [
          ...entityToUpsert.archives,
          {
            garantiesFinancières:
              Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType(
                entityToUpsert.actuelles,
              ).formatter(),
            motifArchivage:
              entityToUpsert.statut === 'échu'
                ? Lauréat.GarantiesFinancières.MotifArchivageGarantiesFinancières
                    .renouvellementDesGarantiesFinancièresÉchues.motif
                : Lauréat.GarantiesFinancières.MotifArchivageGarantiesFinancières
                    .modificationDesGarantiesFinancières.motif,
            validéLe: entityToUpsert.actuelles.validéLe,
          },
        ]
      : entityToUpsert.archives
    : [];

  const garantiesFinancières = await match(event)
    .returnType<Promise<Omit<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity, 'type'>>>()
    .with({ type: 'DépôtGarantiesFinancièresEnCoursValidé-V1' }, async ({ payload }) => {
      if (Option.isNone(entityToUpsert) || !entityToUpsert.dépôt) {
        throw new Error('Pas de dépôt en cours de garanties financières à valider');
      }

      return {
        identifiantProjet: payload.identifiantProjet,
        statut: 'validé',
        actuelles: {
          ...Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType(
            entityToUpsert.dépôt,
          ).formatter(),
          validéLe: payload.validéLe,
        },
        dépôt: undefined,
        soumisLe: DateTime.convertirEnValueType(entityToUpsert.dépôt.soumisLe).formatter(),
        archives,
        dernièreMiseÀJour: {
          date: payload.validéLe,
          par: payload.validéPar,
        },
      };
    })
    .with({ type: 'DépôtGarantiesFinancièresEnCoursValidé-V2' }, async ({ payload }) => ({
      identifiantProjet: payload.identifiantProjet,
      statut: 'validé',
      actuelles: {
        ...Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType(
          payload,
        ).formatter(),
        validéLe: payload.validéLe,
      },
      dépôt: undefined,
      soumisLe: payload.soumisLe,
      validéLe: payload.validéLe,
      dernièreMiseÀJour: {
        date: payload.validéLe,
        par: payload.validéPar,
      },
      archives,
    }))
    .exhaustive();

  await upsertProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${event.payload.identifiantProjet}`,
    garantiesFinancières,
  );
};
