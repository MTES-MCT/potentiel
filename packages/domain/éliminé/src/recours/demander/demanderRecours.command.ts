import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';
import { LoadAggregate } from '@potentiel-domain/core';

import { loadRecoursFactory } from '../recours.aggregate';

export type DemanderRecoursCommand = Message<
  'Éliminé.Recours.Command.DemanderRecours',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    raison: string;
    pièceJustificative: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateDemande: DateTime.ValueType;
  }
>;

export const registerDemanderRecoursCommand = (loadAggregate: LoadAggregate) => {
  const loadRecours = loadRecoursFactory(loadAggregate);

  const handler: MessageHandler<DemanderRecoursCommand> = async ({
    identifiantProjet,
    pièceJustificative,
    raison,
    identifiantUtilisateur,
    dateDemande,
  }) => {
    const recours = await loadRecours(identifiantProjet, false);

    await recours.demander({
      identifiantProjet,
      pièceJustificative,
      raison,
      identifiantUtilisateur,
      dateDemande,
    });
  };
  mediator.register('Éliminé.Recours.Command.DemanderRecours', handler);
};
