import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

export type ModifierProducteurCommand = Message<
  'Lauréat.Producteur.Command.ModifierProducteur',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    producteur: string;
    dateModification: DateTime.ValueType;
  }
>;

export const registerModifierProducteurCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierProducteurCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.producteur.modifier(payload);
  };
  mediator.register('Lauréat.Producteur.Command.ModifierProducteur', handler);
};
