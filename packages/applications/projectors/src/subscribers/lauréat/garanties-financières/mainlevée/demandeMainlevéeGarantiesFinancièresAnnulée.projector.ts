import { Lauréat } from '@potentiel-domain/projet';
import { removeProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getMainlevéeGf } from '../_utils';

export const demandeMainlevéeGarantiesFinancièresAnnuléeProjector = async ({
  payload: { identifiantProjet },
}: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAnnuléeEvent) => {
  const mainlevéeASupprimer = await getMainlevéeGf(identifiantProjet);

  await removeProjection<Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
    `mainlevee-garanties-financieres|${identifiantProjet}#${mainlevéeASupprimer.demande.demandéeLe}`,
  );
};
