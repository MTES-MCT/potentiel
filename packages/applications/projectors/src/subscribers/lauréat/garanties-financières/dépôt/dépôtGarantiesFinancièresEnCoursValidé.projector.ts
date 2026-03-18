import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
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

  if (Option.isNone(entityToUpsert)) {
    throw new Error('Pas de garanties financières à mettre à jour');
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
            motifArchivage:
              entityToUpsert.statut === 'échu'
                ? Lauréat.GarantiesFinancières.MotifArchivageGarantiesFinancières
                    .renouvellementDesGarantiesFinancièresÉchues.motif
                : Lauréat.GarantiesFinancières.MotifArchivageGarantiesFinancières
                    .modificationDesGarantiesFinancières.motif,
            validéLe: entityToUpsert.validéLe,
          },
        ]
      : entityToUpsert.archives;

  const garantiesFinancières = await match(event)
    .returnType<Promise<Omit<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity, 'type'>>>()
    .with({ type: 'DépôtGarantiesFinancièresEnCoursValidé-V1' }, async ({ payload }) => {
      const dépôtExistant =
        await findProjection<Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEntity>(
          `depot-en-cours-garanties-financieres|${payload.identifiantProjet}`,
        );

      if (Option.isNone(dépôtExistant)) {
        throw new Error(
          `dépôt garanties financières en cours absent, impossible d'enregistrer les données des garanties financières validées`,
        );
      }

      return {
        identifiantProjet: payload.identifiantProjet,
        statut: 'validé',
        actuelles: Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType(
          dépôtExistant.dépôt,
        ).formatter(),
        soumisLe: DateTime.convertirEnValueType(dépôtExistant.dépôt.soumisLe).formatter(),
        validéLe: payload.validéLe,
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
      actuelles:
        Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType(payload).formatter(),
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

  await removeProjection<Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEntity>(
    `depot-en-cours-garanties-financieres|${event.payload.identifiantProjet}`,
  );
};
