import { Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getMainlevéeGf } from '../_utils/index.js';

export const demandeMainlevéeGarantiesFinancièresRejetéeProjector = async ({
  payload: { identifiantProjet, rejetéLe, rejetéPar, réponseSignée },
}: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresRejetéeEvent) => {
  const mainlevéeARejeter = await getMainlevéeGf(identifiantProjet);

  await updateOneProjection<Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
    `mainlevee-garanties-financieres|${identifiantProjet}#${mainlevéeARejeter.demande.demandéeLe}`,
    {
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
