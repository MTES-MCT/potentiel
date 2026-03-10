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
  const garantiesFinancières = await match(event)
    .returnType<
      Promise<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity['garantiesFinancières']>
    >()
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
        statut: 'validé',
        type: dépôtExistant.dépôt.type,
        dateÉchéance: dépôtExistant.dépôt.dateÉchéance,
        attestation: dépôtExistant.dépôt.attestation,
        dateConstitution: dépôtExistant.dépôt.dateConstitution,
        soumisLe: dépôtExistant.dépôt.soumisLe,
        validéLe: payload.validéLe,
        dernièreMiseÀJour: {
          date: payload.validéLe,
          par: payload.validéPar,
        },
      };
    })
    .with({ type: 'DépôtGarantiesFinancièresEnCoursValidé-V2' }, async ({ payload }) => ({
      statut: 'validé',
      type: payload.type,
      dateÉchéance: payload.dateÉchéance,
      attestation: payload.attestation,
      dateConstitution: payload.dateConstitution,
      validéLe: payload.validéLe,
      soumisLe: payload.soumisLe,
      dernièreMiseÀJour: {
        date: payload.validéLe,
        par: payload.validéPar,
      },
    }))
    .exhaustive();

  const gfActuelles = await getGfActuelles(event.payload.identifiantProjet);
  if (gfActuelles) {
    const motif: Lauréat.GarantiesFinancières.ArchiveGarantiesFinancières['motif'] =
      gfActuelles.garantiesFinancières.statut === 'échu'
        ? 'renouvellement des garanties financières échues'
        : 'modification des garanties financières';

    const archivesGf = await getArchivesGf(event.payload.identifiantProjet);

    const archiveÀAjouter = {
      ...gfActuelles.garantiesFinancières,
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
      { garantiesFinancières },
    );
  } else {
    await upsertProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
      `garanties-financieres|${event.payload.identifiantProjet}`,
      { identifiantProjet: event.payload.identifiantProjet, garantiesFinancières },
    );
  }

  await removeProjection<Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEntity>(
    `depot-en-cours-garanties-financieres|${event.payload.identifiantProjet}`,
  );
};
