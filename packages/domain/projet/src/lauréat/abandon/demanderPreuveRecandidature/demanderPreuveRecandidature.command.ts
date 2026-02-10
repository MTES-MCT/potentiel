import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type DemanderPreuveRecandidatureAbandonCommand = Message<
  'System.Lauréat.Abandon.Command.DemanderPreuveRecandidatureAbandon',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateDemande: DateTime.ValueType;
  }
>;

export const registerDemanderPreuveRecandidatureAbandonCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<DemanderPreuveRecandidatureAbandonCommand> = async ({
    identifiantProjet,
    dateDemande,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);
    await projet.lauréat.abandon.demanderPreuveRecandidature({
      dateDemande,
    });
  };
  mediator.register('System.Lauréat.Abandon.Command.DemanderPreuveRecandidatureAbandon', handler);
};
