import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type {
  DocumentProjet,
  GetProjetAggregateRoot,
  IdentifiantProjet,
} from '../../../../index.js';

export type DemanderAbandonCommand = Message<
  'Lauréat.Abandon.Command.DemanderAbandon',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    raison: string;
    pièceJustificative: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateDemande: DateTime.ValueType;
    PPASignalé?: true;
  }
>;

export const registerDemanderAbandonCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<DemanderAbandonCommand> = async ({
    identifiantProjet,
    pièceJustificative,
    raison,
    identifiantUtilisateur,
    dateDemande,
    PPASignalé,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.abandon.demander({
      pièceJustificative,
      raison,
      identifiantUtilisateur,
      dateDemande,
      PPASignalé,
    });
  };
  mediator.register('Lauréat.Abandon.Command.DemanderAbandon', handler);
};
