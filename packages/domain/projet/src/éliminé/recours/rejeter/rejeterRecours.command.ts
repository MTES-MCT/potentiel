import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port';
import { IdentifiantProjet } from '../../..';

export type RejeterRecoursCommand = Message<
  'Éliminé.Recours.Command.RejeterRecours',
  {
    dateRejet: DateTime.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
  }
>;

export const registerRejeterRecoursCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<RejeterRecoursCommand> = async ({
    identifiantProjet,
    réponseSignée,
    dateRejet,
    identifiantUtilisateur,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.éliminé.recours.rejeter({
      dateRejet,
      identifiantProjet,
      identifiantUtilisateur,
      réponseSignée,
    });
  };
  mediator.register('Éliminé.Recours.Command.RejeterRecours', handler);
};
