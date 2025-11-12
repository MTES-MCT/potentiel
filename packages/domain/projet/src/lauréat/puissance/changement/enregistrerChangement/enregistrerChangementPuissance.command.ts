import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type EnregistrerChangementPuissanceCommand = Message<
  'Lauréat.Puissance.Command.EnregistrerChangement',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    puissance: number;
    puissanceDeSite?: number;
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
    puissance,
    puissanceDeSite,
    dateChangement,
    pièceJustificative,
    raison,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.puissance.enregistrerChangement({
      puissance,
      puissanceDeSite,
      identifiantUtilisateur,
      dateChangement,
      pièceJustificative,
      raison,
    });
  };
  mediator.register('Lauréat.Puissance.Command.EnregistrerChangement', handler);
};
