import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/document';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

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
