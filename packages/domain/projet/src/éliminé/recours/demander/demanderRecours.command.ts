import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { GetProjetAggregateRoot } from '../../../getProjetAggregateRoot.port';
import { IdentifiantProjet } from '../../..';

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
      identifiantProjet,
      pièceJustificative,
      raison,
      identifiantUtilisateur,
      dateDemande,
    });
  };
  mediator.register('Éliminé.Recours.Command.DemanderRecours', handler);
};
