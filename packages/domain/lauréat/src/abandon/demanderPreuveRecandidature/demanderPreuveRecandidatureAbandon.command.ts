import { Message, MessageHandler, mediator } from 'mediateur';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { loadAbandonFactory } from '../abandon.aggregate';
import { LoadAggregate } from '@potentiel-domain/core';

export type DemanderPreuveRecandidatureAbandonCommand = Message<
  'Lauréat.Abandon.Command.DemanderPreuveRecandidatureAbandon',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    dateDemande: DateTime.ValueType;
  }
>;

export const registerDemanderPreuveRecandidatureAbandonCommand = (loadAggregate: LoadAggregate) => {
  const loadAbandon = loadAbandonFactory(loadAggregate);
  const handler: MessageHandler<DemanderPreuveRecandidatureAbandonCommand> = async ({
    identifiantProjet,
    dateDemande,
  }) => {
    const abandon = await loadAbandon(identifiantProjet);
    await abandon.demanderPreuveRecandidature({
      identifiantProjet,
      dateDemande,
    });
  };
  mediator.register('Lauréat.Abandon.Command.DemanderPreuveRecandidatureAbandon', handler);
};
