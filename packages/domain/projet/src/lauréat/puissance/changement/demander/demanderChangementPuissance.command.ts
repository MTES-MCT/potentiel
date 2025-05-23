import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { GetProjetAggregateRoot } from '../../../..';

export type DemanderChangementCommand = Message<
  'Lauréat.Puissance.Command.DemanderChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    raison: string;
    nouvellePuissance: number;
    pièceJustificative: DocumentProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    dateDemande: DateTime.ValueType;
  }
>;

export const registerDemanderChangementPuissanceCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<DemanderChangementCommand> = async ({
    identifiantProjet,
    pièceJustificative,
    raison,
    nouvellePuissance,
    identifiantUtilisateur,
    dateDemande,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.puissance.demanderChangement({
      nouvellePuissance,
      pièceJustificative,
      raison,
      identifiantUtilisateur,
      dateDemande,
    });
  };
  mediator.register('Lauréat.Puissance.Command.DemanderChangement', handler);
};
