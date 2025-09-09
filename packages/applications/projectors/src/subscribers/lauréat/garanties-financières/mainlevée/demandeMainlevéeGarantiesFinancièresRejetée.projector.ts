import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getMainlevéeGf } from '../_utils';

export const demandeMainlevéeGarantiesFinancièresRejetéeProjector = async ({
  payload: { identifiantProjet, rejetéLe, rejetéPar, réponseSignée },
}: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresRejetéeEvent) => {
  const mainlevéeARejeter = await getMainlevéeGf(identifiantProjet);

  await upsertProjection<Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
    `mainlevee-garanties-financieres|${identifiantProjet}#${mainlevéeARejeter.demande.demandéeLe}`,
    {
      ...mainlevéeARejeter,
      statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.rejeté.statut,
      rejet: {
        rejetéLe,
        rejetéPar,
        courrierRejet: { format: réponseSignée.format },
      },
      dernièreMiseÀJour: {
        date: rejetéLe,
        par: rejetéPar,
      },
    },
  );
};
