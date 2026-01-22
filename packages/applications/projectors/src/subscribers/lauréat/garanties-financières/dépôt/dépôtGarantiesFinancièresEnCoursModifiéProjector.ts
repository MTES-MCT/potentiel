import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { getLogger } from '@potentiel-libraries/monitoring';

import { getDépôtGf } from '../_utils/index.js';

export const dépôtGarantiesFinancièresEnCoursModifiéProjector = async ({
  payload: {
    identifiantProjet,
    type,
    dateÉchéance,
    dateConstitution,
    attestation,
    modifiéLe,
    modifiéPar,
  },
}: Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursModifiéEvent) => {
  const dépôtExistant = await getDépôtGf(identifiantProjet);

  if (!dépôtExistant) {
    getLogger().error(`Dépôt de garanties financières non trouvé`, {
      identifiantProjet,
      fonction: 'dépôtGarantiesFinancièresEnCoursModifiéProjector',
    });
    return;
  }

  await upsertProjection<Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEntity>(
    `depot-en-cours-garanties-financieres|${identifiantProjet}`,
    {
      identifiantProjet,
      dépôt: {
        ...dépôtExistant.dépôt,
        type,
        dateConstitution,
        attestation,
        dateÉchéance,
        dernièreMiseÀJour: {
          date: modifiéLe,
          par: modifiéPar,
        },
      },
    },
  );
};
