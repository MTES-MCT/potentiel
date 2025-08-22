import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type AccorderDemandeDélaiCommand = Message<
  'Lauréat.Délai.Command.AccorderDemandeDélai',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateAccord: DateTime.ValueType;
    nombreDeMois: number;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerAccorderDemandeDélaiCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<AccorderDemandeDélaiCommand> = async ({
    identifiantProjet,
    dateAccord,
    identifiantUtilisateur,
    nombreDeMois,
    réponseSignée,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.délai.accorderDemandeDélai({
      identifiantUtilisateur,
      réponseSignée,
      dateAccord,
      nombreDeMois,
    });
  };
  mediator.register('Lauréat.Délai.Command.AccorderDemandeDélai', handler);
};
