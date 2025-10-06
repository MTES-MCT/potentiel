import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';

export type ModifierInstallateurCommand = Message<
  'Lauréat.Installation.Command.ModifierInstallateur',
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
    await projet.lauréat.installateur.modifierInstallateur(payload);
  };
  mediator.register('Lauréat.Installation.Command.ModifierInstallateur', handler);
};
