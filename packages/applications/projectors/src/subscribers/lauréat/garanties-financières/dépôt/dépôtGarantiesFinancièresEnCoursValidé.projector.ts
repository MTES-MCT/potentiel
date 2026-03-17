import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';
import {
  removeProjection,
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

import { getArchivesGf, getGfActuelles } from '../_utils/index.js';

export const dépôtGarantiesFinancièresEnCoursValidéProjector = async (
  event:
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEventV1
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent,
) => {
  const nouvellesGarantiesFinancières = await match(event)
    .returnType<Promise<Lauréat.GarantiesFinancières.GarantiesFinancières.ValueType>>()
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

      return Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType(
        dépôtExistant.dépôt,
      );
    })
    .with({ type: 'DépôtGarantiesFinancièresEnCoursValidé-V2' }, async ({ payload }) =>
      Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType(payload),
    )
    .exhaustive();

  const garantiesFinancières: Omit<
    Lauréat.GarantiesFinancières.GarantiesFinancièresEntity,
    'type'
  > = {
    identifiantProjet: event.payload.identifiantProjet,
    actuelles: nouvellesGarantiesFinancières.formatter(),
    statut: 'validé',
    dernièreMiseÀJour: {
      date: event.payload.validéLe,
      par: event.payload.validéPar,
    },
  };
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

    await updateOneProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
      `garanties-financieres|${event.payload.identifiantProjet}`,
      garantiesFinancières,
    );
  } else {
    await upsertProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
      `garanties-financieres|${event.payload.identifiantProjet}`,
      garantiesFinancières,
    );
    await removeProjection<Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEntity>(
      `depot-en-cours-garanties-financieres|${event.payload.identifiantProjet}`,
    );
    return;
  }

  await removeProjection<Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEntity>(
    `depot-en-cours-garanties-financieres|${event.payload.identifiantProjet}`,
  );

  await removeProjection<Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEntity>(
    `depot-en-cours-garanties-financieres|${event.payload.identifiantProjet}`,
  );
};
