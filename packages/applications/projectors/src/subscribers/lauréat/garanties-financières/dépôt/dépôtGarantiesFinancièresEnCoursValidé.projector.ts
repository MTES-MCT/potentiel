import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection, upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { getLogger } from '@potentiel-libraries/monitoring';

import { getArchivesGf, getDépôtGf, getGfActuelles } from '../_utils';

export const dépôtGarantiesFinancièresEnCoursValidéProjector = async ({
  payload: { identifiantProjet, validéLe, validéPar },
}:
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEventV1
  | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursValidéEvent) => {
  const dépôtExistant = await getDépôtGf(identifiantProjet);

  if (!dépôtExistant) {
    getLogger().error(
      new Error(
        `dépôt garanties financières en cours absent, impossible d'enregistrer les données des garanties financières validées`,
      ),
      {
        identifiantProjet,
        message: event,
      },
    );
    return;
  }

  const gfActuelles = await getGfActuelles(identifiantProjet);

  if (gfActuelles) {
    const motif: GarantiesFinancières.ArchiveGarantiesFinancières['motif'] =
      gfActuelles.garantiesFinancières.statut === 'échu'
        ? 'renouvellement des garanties financières échues'
        : 'modification des garanties financières';

    const archivesGf = await getArchivesGf(identifiantProjet);

    const archiveÀAjouter = {
      ...gfActuelles.garantiesFinancières,
      dernièreMiseÀJour: {
        date: validéLe,
        par: validéPar,
      },
      motif,
    };

    await upsertProjection<GarantiesFinancières.ArchivesGarantiesFinancièresEntity>(
      `archives-garanties-financieres|${identifiantProjet}`,
      {
        identifiantProjet,
        archives: archivesGf ? [...archivesGf.archives, archiveÀAjouter] : [archiveÀAjouter],
      },
    );

    await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet}`,
      {
        ...gfActuelles,
        garantiesFinancières: {
          statut: GarantiesFinancières.StatutGarantiesFinancières.validé.statut,
          type: dépôtExistant.dépôt.type,
          ...(dépôtExistant.dépôt.dateÉchéance && {
            dateÉchéance: dépôtExistant.dépôt.dateÉchéance,
          }),
          attestation: dépôtExistant.dépôt.attestation,
          dateConstitution: dépôtExistant.dépôt.dateConstitution,
          validéLe,
          soumisLe: dépôtExistant.dépôt.soumisLe,
          dernièreMiseÀJour: {
            date: validéLe,
            par: validéPar,
          },
        },
      },
    );
  } else {
    await upsertProjection<GarantiesFinancières.GarantiesFinancièresEntity>(
      `garanties-financieres|${identifiantProjet}`,
      {
        identifiantProjet,
        garantiesFinancières: {
          statut: 'validé',
          type: dépôtExistant.dépôt.type,
          ...(dépôtExistant.dépôt.dateÉchéance && {
            dateÉchéance: dépôtExistant.dépôt.dateÉchéance,
          }),
          attestation: dépôtExistant.dépôt.attestation,
          dateConstitution: dépôtExistant.dépôt.dateConstitution,
          validéLe,
          soumisLe: dépôtExistant.dépôt.soumisLe,
          dernièreMiseÀJour: {
            date: validéLe,
            par: validéPar,
          },
        },
      },
    );
  }

  await removeProjection<Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEntity>(
    `depot-en-cours-garanties-financieres|${identifiantProjet}`,
  );
};
