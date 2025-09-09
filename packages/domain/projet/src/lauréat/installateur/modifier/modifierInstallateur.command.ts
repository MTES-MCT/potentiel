import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../..';

export type ModifierInstallateurCommand = Message<
  'Lauréat.Installateur.Command.ModifierInstallateur',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    installateur: string;
    dateModification: DateTime.ValueType;
  }
>;

export const registerModifierInstallateurCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierInstallateurCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.installateur.modifier(payload);
  };
  mediator.register('Lauréat.Installateur.Command.ModifierInstallateur', handler);
};
