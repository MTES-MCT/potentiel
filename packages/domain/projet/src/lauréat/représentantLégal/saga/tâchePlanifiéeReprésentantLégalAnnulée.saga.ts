import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { IdentifiantProjet, Lauréat } from '../../..';
import { SupprimerDocumentProjetSensibleCommand } from '../changement/supprimerDocumentSensible/supprimerDocumentProjetSensible.command';

export const tâchePlanifiéeReprésentantLégalAnnuléeSaga = async (
  event: Lauréat.TâchePlanifiée.TâchePlanifiéeAnnuléeEvent,
) => {
  const { payload } = event;

  return match(payload)
    .with(
      { typeTâchePlanifiée: 'représentant-légal.suppression-document-à-trois-mois' },
      tâchePlanifiéeSuppressionDocumentAnnuléeSaga,
    )
    .otherwise(() => {});
};

const tâchePlanifiéeSuppressionDocumentAnnuléeSaga = async ({
  identifiantProjet,
}: Lauréat.TâchePlanifiée.TâchePlanifiéeAnnuléeEvent['payload']) => {
  await mediator.send<SupprimerDocumentProjetSensibleCommand>({
    type: 'Lauréat.ReprésentantLégal.Command.SupprimerDocumentProjetSensible',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      raison:
        'Pièce justificative supprimée automatiquement car un nouveau changement a été déclaré',
    },
  });
};
