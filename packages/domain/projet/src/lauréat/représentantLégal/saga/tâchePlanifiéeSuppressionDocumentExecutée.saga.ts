import { mediator } from 'mediateur';

import { TypeTâchePlanifiéeChangementReprésentantLégal } from '..';
import { IdentifiantProjet, Lauréat } from '../../..';
import { SupprimerDocumentProjetSensibleCommand } from '../changement/supprimerDocumentSensible/supprimerDocumentProjetSensible.command';

export const tâchePlanifiéeSuppressionDocumentExecutéeSaga = async ({
  payload: { identifiantProjet, typeTâchePlanifiée },
}: Lauréat.TâchePlanifiée.TâchePlanifiéeExecutéeEvent) => {
  if (
    typeTâchePlanifiée !==
    TypeTâchePlanifiéeChangementReprésentantLégal.suppressionDocumentÀTroisMois.type
  ) {
    return;
  }

  await mediator.send<SupprimerDocumentProjetSensibleCommand>({
    type: 'Lauréat.ReprésentantLégal.Command.SupprimerDocumentProjetSensible',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      raison: 'Pièce justificative supprimée automatiquement après 3 mois',
    },
  });
};
