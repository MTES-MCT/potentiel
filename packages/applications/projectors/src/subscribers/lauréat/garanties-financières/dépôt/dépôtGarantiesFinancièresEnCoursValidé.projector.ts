import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';

import { getArchivesGf, getGfActuelles } from '../_utils/index.js';

export const dépôtGarantiesFinancièresEnCoursValidéProjector = async (
  event:
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEventV1
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent,
) => {
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
    }))
    .exhaustive();

  const gfActuelles = await getGfActuelles(event.payload.identifiantProjet);

  if (gfActuelles?.actuelles) {
    const motif: Lauréat.GarantiesFinancières.ArchiveGarantiesFinancières['motif'] =
      gfActuelles.statut === 'échu'
        ? 'renouvellement des garanties financières échues'
        : 'modification des garanties financières';

    const archivesGf = await getArchivesGf(event.payload.identifiantProjet);

    const archiveÀAjouter: Lauréat.GarantiesFinancières.ArchiveGarantiesFinancières = {
      statut: gfActuelles.statut,
      ...Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType(
        gfActuelles.actuelles,
      ).formatter(),
      dernièreMiseÀJour: {
        date: event.payload.validéLe,
        par: event.payload.validéPar,
      },
      motif,
    };

    await upsertProjection<Lauréat.GarantiesFinancières.ArchivesGarantiesFinancièresEntity>(
      `archives-garanties-financieres|${event.payload.identifiantProjet}`,
      {
        identifiantProjet: event.payload.identifiantProjet,
        archives: archivesGf ? [...archivesGf.archives, archiveÀAjouter] : [archiveÀAjouter],
      },
    );
  }

  await upsertProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${event.payload.identifiantProjet}`,
    garantiesFinancières,
  );

  await removeProjection<Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEntity>(
    `depot-en-cours-garanties-financieres|${event.payload.identifiantProjet}`,
  );
};
