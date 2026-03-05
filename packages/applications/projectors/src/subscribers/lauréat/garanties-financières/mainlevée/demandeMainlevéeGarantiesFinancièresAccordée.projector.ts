import { Lauréat } from '@potentiel-domain/projet';
import {
  removeProjection,
  updateOneProjection,
} from '@potentiel-infrastructure/pg-projection-write';

import { getMainlevéeGf } from '../_utils/index.js';

export const demandeMainlevéeGarantiesFinancièresAccordéeProjector = async ({
  payload: { identifiantProjet, accordéLe, accordéPar, réponseSignée },
}: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAccordéeEvent) => {
  const mainlevéeAAccorder = await getMainlevéeGf(identifiantProjet);

  await updateOneProjection<Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
    `mainlevee-garanties-financieres|${identifiantProjet}#${mainlevéeAAccorder.demande.demandéeLe}`,
    {
      statut: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.accordé.statut,
      accord: {
        accordéeLe: accordéLe,
        accordéePar: accordéPar,
        courrierAccord: { format: réponseSignée.format },
      },
      dernièreMiseÀJour: {
        date: accordéLe,
        par: accordéPar,
      },
    },
  );

  await updateOneProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      garantiesFinancières: {
        statut: 'levé',
        dernièreMiseÀJour: {
          date: accordéLe,
          par: accordéPar,
        },
      },
    },
  );

  await removeProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEnAttenteEntity>(
    `projet-avec-garanties-financieres-en-attente|${identifiantProjet}`,
  );
};
