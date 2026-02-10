import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type ModifierPuissanceCommand = Message<
  'Lauréat.Puissance.Command.ModifierPuissance',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    puissance: number;
    puissanceDeSite?: number;
    dateModification: DateTime.ValueType;
    pièceJustificative?: DocumentProjet.ValueType;
    raison: string;
  }
>;

export const registerModifierPuissanceCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierPuissanceCommand> = async ({
    identifiantProjet,
    identifiantUtilisateur,
    puissance,
    puissanceDeSite,
    dateModification,
    raison,
    pièceJustificative,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.puissance.modifier({
      identifiantUtilisateur,
      puissance,
      puissanceDeSite,
      dateModification,
      raison,
      pièceJustificative,
    });
  };
  mediator.register('Lauréat.Puissance.Command.ModifierPuissance', handler);
};
