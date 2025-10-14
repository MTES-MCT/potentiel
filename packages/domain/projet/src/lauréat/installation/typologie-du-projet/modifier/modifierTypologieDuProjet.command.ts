import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';
import { TypologieDuProjet } from '../../../../candidature';

export type ModifierTypologieDuProjetCommand = Message<
  'Lauréat.Installation.Command.ModifierTypologieDuProjet',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    typologieDuProjet: TypologieDuProjet.ValueType[];
    dateModification: DateTime.ValueType;
  }
>;

export const registerModifierTypologieDuProjetCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierTypologieDuProjetCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.installation.modifierTypologieDuProjet(payload);
  };
  mediator.register('Lauréat.Installation.Command.ModifierTypologieDuProjet', handler);
};
