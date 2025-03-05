import { Recours } from '@potentiel-domain/elimine';

import { updateOneProjection } from '../../../infrastructure';

export const recoursAccordéProjector = async ({
  payload: {
    identifiantProjet,
    accordéLe,
    accordéPar,
    réponseSignée: { format },
  },
}: Recours.RecoursAccordéEvent) => {
  await updateOneProjection<Recours.RecoursEntity>(`recours|${identifiantProjet}`, {
    demande: {
      accord: {
        accordéLe: accordéLe,
        accordéPar: accordéPar,
        réponseSignée: {
          format: format,
        },
      },
    },
    statut: Recours.StatutRecours.accordé.value,
    misÀJourLe: accordéLe,
  });
};
