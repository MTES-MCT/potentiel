// Third party
import { Message, MessageHandler, mediator } from 'mediateur';

// Workspaces
import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { DocumentProjet } from '@potentiel-domain/document';

// Package
import { loadRecoursFactory } from '../recours.aggregate';

export type AccorderRecoursCommand = Message<
  'Éliminé.Recours.Command.AccorderRecours',
  {
    dateAccord: DateTime.ValueType;
    identifiantUtilisateur: Email.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
    réponseSignée: DocumentProjet.ValueType;
  }
>;

export const registerAccorderRecoursCommand = (loadAggregate: LoadAggregate) => {
  const loadRecours = loadRecoursFactory(loadAggregate);
  const handler: MessageHandler<AccorderRecoursCommand> = async ({
    dateAccord,
    identifiantUtilisateur,
    identifiantProjet,
    réponseSignée,
  }) => {
    const recours = await loadRecours(identifiantProjet);

    await recours.accorder({
      dateAccord,
      identifiantUtilisateur,
      identifiantProjet,
      réponseSignée,
    });
  };
  mediator.register('Éliminé.Recours.Command.AccorderRecours', handler);
};
