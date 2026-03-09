import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';
import {
  removeProjection,
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';
import { getLogger } from '@potentiel-libraries/monitoring';

import { getArchivesGf, getDépôtGf, getGfActuelles } from '../_utils/index.js';

export const dépôtGarantiesFinancièresEnCoursValidéProjector = async (
  event:
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEventV1
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent,
) => {
  const garantiesFinancières:
    | Lauréat.GarantiesFinancières.GarantiesFinancièresEntity['garantiesFinancières']
    | undefined = await match(event)
    .with({ type: 'DépôtGarantiesFinancièresEnCoursValidé-V1' }, async (event) => {
      const dépôtExistant = await getDépôtGf(event.payload.identifiantProjet);

      if (!dépôtExistant) {
        getLogger().error(
          new Error(
            `dépôt garanties financières en cours absent, impossible d'enregistrer les données des garanties financières validées`,
          ),
          {
            identifiantProjet: event.payload.identifiantProjet,
            message: event,
          },
        );
        return;
      }

      return {
        statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.validé.statut,
        type: dépôtExistant.dépôt.type,
        dateÉchéance: dépôtExistant.dépôt.dateÉchéance,
        attestation: dépôtExistant.dépôt.attestation,
        dateConstitution: dépôtExistant.dépôt.dateConstitution,
        validéLe: event.payload.validéLe,
        soumisLe: dépôtExistant.dépôt.soumisLe,
        dernièreMiseÀJour: {
          date: event.payload.validéLe,
          par: event.payload.validéPar,
        },
      };
    })
    .with({ type: 'DépôtGarantiesFinancièresEnCoursValidé-V2' }, async (event) => ({
      statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.validé.statut,
      type: event.payload.type,
      dateÉchéance: event.payload.dateÉchéance,
      attestation: event.payload.attestation,
      dateConstitution: event.payload.dateConstitution,
      validéLe: event.payload.validéLe,
      soumisLe: event.payload.soumisLe,
      dernièreMiseÀJour: {
        date: event.payload.validéLe,
        par: event.payload.validéPar,
      },
    }))
    .exhaustive();

  if (!garantiesFinancières) {
    getLogger().error(new Error(`Impossible de constituer les nouvelles garanties financières`), {
      identifiantProjet: event.payload.identifiantProjet,
      message: event,
    });

    return;
  }

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
      {
        garantiesFinancières,
      },
    );
  } else {
    await upsertProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
      `garanties-financieres|${event.payload.identifiantProjet}`,
      {
        identifiantProjet: event.payload.identifiantProjet,
        garantiesFinancières,
      },
    );
  }

  await removeProjection<Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEntity>(
    `depot-en-cours-garanties-financieres|${event.payload.identifiantProjet}`,
  );
};
