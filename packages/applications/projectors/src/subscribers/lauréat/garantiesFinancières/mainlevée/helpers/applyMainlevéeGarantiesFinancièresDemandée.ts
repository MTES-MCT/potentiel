import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { upsertProjection } from '../../../../../infrastructure/upsertProjection';
import { getProjectData } from '../../../../../helpers/getProjectData';

export const applyMainlevéeGarantiesFinancièresDemandée = async ({
  payload: { identifiantProjet, motif, demandéLe, demandéPar },
}: GarantiesFinancières.MainlevéeGarantiesFinancièresDemandéeEvent) => {
  const entityKey = `${identifiantProjet}#${demandéLe}`;
  const détailProjet = await getProjectData(identifiantProjet);

  const data = {
    identifiantProjet,
    ...détailProjet,

    motif,
    demandéLe,
    demandéPar,

    dernièreMiseÀJourLe: demandéLe,
    dernièreMiseÀJourPar: demandéPar,

    statut: GarantiesFinancières.StatutMainlevéeGarantiesFinancières.demandé.statut,
  };

  await upsertProjection<GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
    `mainlevee-garanties-financieres|${entityKey}`,
    data,
  );
};
