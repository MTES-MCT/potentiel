import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet, DateTime, Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { GetProjetAggregateRoot } from '../../../..';

export type EnregistrerChangementPuissanceCommand = Message<
  'Lauréat.Puissance.Command.EnregistrerChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    nouvellePuissance: number;
    dateChangement: DateTime.ValueType;
    pièceJustificative?: DocumentProjet.ValueType;
    raison?: string;
  }
>;

export const registerEnregistrerChangementPuissanceCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<EnregistrerChangementPuissanceCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    nouvellePuissance,
    dateChangement,
    pièceJustificative,
    raison,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.puissance.enregistrerChangement({
      nouvellePuissance,
      identifiantUtilisateur,
      dateChangement,
      pièceJustificative,
      raison,
    });
  };
  mediator.register('Lauréat.Puissance.Command.EnregistrerChangement', handler);
};
