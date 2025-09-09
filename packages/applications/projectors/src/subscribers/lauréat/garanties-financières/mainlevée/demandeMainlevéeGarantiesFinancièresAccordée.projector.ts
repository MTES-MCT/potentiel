import { Lauréat } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { getLogger } from '@potentiel-libraries/monitoring';

import { getGfActuelles, getMainlevéeGf } from '../_utils';

export const demandeMainlevéeGarantiesFinancièresAccordéeProjector = async ({
  payload: { identifiantProjet, accordéLe, accordéPar, réponseSignée },
}: Lauréat.GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAccordéeEvent) => {
  const mainlevéeAAccorder = await getMainlevéeGf(identifiantProjet);
  const gfActuelles = await getGfActuelles(identifiantProjet);

  if (!gfActuelles) {
    if (!gfActuelles) {
      getLogger().error(`garanties financières non trouvé`, {
        identifiantProjet,
        fonction: 'demandeMainlevéeGarantiesFinancièresAccordéeProjector',
      });
      return;
    }
  }

  await upsertProjection<Lauréat.GarantiesFinancières.MainlevéeGarantiesFinancièresEntity>(
    `mainlevee-garanties-financieres|${identifiantProjet}#${mainlevéeAAccorder.demande.demandéeLe}`,
    {
      ...mainlevéeAAccorder,
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

  await upsertProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
    `garanties-financieres|${identifiantProjet}`,
    {
      ...gfActuelles,
      garantiesFinancières: {
        ...gfActuelles.garantiesFinancières,
        statut: 'levé',
        dernièreMiseÀJour: {
          date: accordéLe,
          par: accordéPar,
        },
      },
    },
  );
};
