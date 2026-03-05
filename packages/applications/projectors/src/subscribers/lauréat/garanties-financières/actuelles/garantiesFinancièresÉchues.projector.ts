import { Lauréat } from '@potentiel-domain/projet';
import {
  updateOneProjection,
  upsertProjection,
} from '@potentiel-infrastructure/pg-projection-write';

import { getArchivesGf, getGfActuelles } from '../_utils/index.js';

export const garantiesFinancièresÉchuesProjector = async ({
  payload: { identifiantProjet, échuLe },
}: Lauréat.GarantiesFinancières.GarantiesFinancièresÉchuesEvent) => {
  const gfActuelles = await getGfActuelles(identifiantProjet);

  if (!gfActuelles || gfActuelles.garantiesFinancières.statut === 'en-attente') {
    return;
  }

  const archivesGf = await getArchivesGf(identifiantProjet);

  const archiveÀAjouter: Lauréat.GarantiesFinancières.ArchiveGarantiesFinancières = {
    statut: gfActuelles.garantiesFinancières.statut,
    type: gfActuelles.garantiesFinancières.type,
    dateÉchéance: gfActuelles.garantiesFinancières.dateÉchéance,
    attestation: gfActuelles.garantiesFinancières.attestation,
    dateConstitution: gfActuelles.garantiesFinancières.dateConstitution,
    dernièreMiseÀJour: {
      date: gfActuelles.garantiesFinancières.dernièreMiseÀJour.date,
      par: gfActuelles.garantiesFinancières.dernièreMiseÀJour.par,
    },
    motif: 'renouvellement des garanties financières échues',
  };

  await upsertProjection<Lauréat.GarantiesFinancières.ArchivesGarantiesFinancièresEntity>(
    `archives-garanties-financieres|${identifiantProjet}`,
    {
      identifiantProjet,
      archives: archivesGf?.archives.length
        ? [...archivesGf.archives, archiveÀAjouter]
        : [archiveÀAjouter],
    },
  );

  await updateOneProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      garantiesFinancières: {
        statut: 'échu',
        dernièreMiseÀJour: {
          date: échuLe,
        },
      },
    },
  );
};
