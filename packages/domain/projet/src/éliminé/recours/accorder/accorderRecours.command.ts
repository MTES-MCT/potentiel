// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import { DateTime, Email } from '@potentiel-domain/common';

// Package
import { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port';
import { DocumentProjet, IdentifiantProjet } from '../../..';

export type AccorderRecoursCommand = Message<
  'Éliminé.Recours.Command.AccorderRecours',
  {
    dateAccord: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerAccorderRecoursCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<AccorderRecoursCommand> = async ({
    dateAccord,
    identifiantUtilisateur,
    identifiantProjet,
    réponseSignée,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.éliminé.recours.accorder({
      dateAccord,
      identifiantUtilisateur,
      réponseSignée,
    });
  };
  mediator.register('Éliminé.Recours.Command.AccorderRecours', handler);
};
