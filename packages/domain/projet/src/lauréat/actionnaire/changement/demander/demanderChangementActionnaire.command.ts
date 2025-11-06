import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type DemanderChangementCommand = Message<
  'Lauréat.Actionnaire.Command.DemanderChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    raison: string;
    actionnaire: string;
    pièceJustificative: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateDemande: DateTime.ValueType;
  }
>;

export const registerDemanderChangementActionnaireCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<DemanderChangementCommand> = async ({
    identifiantProjet,
    pièceJustificative,
    raison,
    actionnaire,
    identifiantUtilisateur,
    dateDemande,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.actionnaire.demanderChangement({
      pièceJustificative,
      raison,
      identifiantUtilisateur,
      dateDemande,
      actionnaire,
    });
  };
  mediator.register('Lauréat.Actionnaire.Command.DemanderChangement', handler);
};
