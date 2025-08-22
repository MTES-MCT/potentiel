import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';

import type { IdentifiantProjet } from '../../..';
import type { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port';

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

export const registerDemanderRecoursCommand = (getProjetAggregateRoot: GetProjetAggregateRoot) => {
  const handler: MessageHandler<DemanderRecoursCommand> = async ({
    identifiantProjet,
    pièceJustificative,
    raison,
    identifiantUtilisateur,
    dateDemande,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.éliminé.recours.demander({
      pièceJustificative,
      raison,
      identifiantUtilisateur,
      dateDemande,
    });
  };
  mediator.register('Éliminé.Recours.Command.DemanderRecours', handler);
};
