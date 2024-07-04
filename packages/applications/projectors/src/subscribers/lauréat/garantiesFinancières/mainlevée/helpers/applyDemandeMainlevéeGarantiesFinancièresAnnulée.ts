import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { removeProjection } from '../../../../../infrastructure/removeProjection';

import { getMainlevéeDemandée } from './getMainlevéeDemandée';

export const applyDemandeMainlevéeGarantiesFinancièresAnnulée = async ({
  payload: { identifiantProjet },
}: GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAnnuléeEvent) => {
  const toRemove = await getMainlevéeDemandée(identifiantProjet);

  if (toRemove) {
    await removeProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
      `mainlevee-garanties-financieres|${toRemove.identifiantProjet}#${toRemove.demandéLe}`,
    );
  }
};
