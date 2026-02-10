import { mediator } from 'mediateur';

import { SupprimerDocumentProjetSensibleCommand } from '../../changement/supprimerDocumentSensible/supprimerDocumentProjetSensible.command.js';
import { Abandon } from '../../../index.js';
import { IdentifiantProjet } from '../../../../index.js';

export const handleAbandonAccordé = async ({ payload }: Abandon.AbandonAccordéEvent) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

  await mediator.send<SupprimerDocumentProjetSensibleCommand>({
    type: 'Lauréat.ReprésentantLégal.Command.SupprimerDocumentProjetSensible',
    data: {
      identifiantProjet,
      raison: 'Pièce justificative supprimée automatiquement après abandon',
    },
  });
};
