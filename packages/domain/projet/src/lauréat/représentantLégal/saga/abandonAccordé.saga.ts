import { mediator } from 'mediateur';

import { IdentifiantProjet } from '../../..';
import type { Abandon } from '../..';
import type { SupprimerDocumentProjetSensibleCommand } from '../changement/supprimerDocumentSensible/supprimerDocumentProjetSensible.command';

export const abandonAccordéSaga = async ({ payload }: Abandon.AbandonAccordéEvent) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

  await mediator.send<SupprimerDocumentProjetSensibleCommand>({
    type: 'Lauréat.ReprésentantLégal.Command.SupprimerDocumentProjetSensible',
    data: {
      identifiantProjet,
      raison: 'Pièce justificative supprimée automatiquement après abandon',
    },
  });
};
