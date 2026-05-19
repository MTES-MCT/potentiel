import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type {
  DocumentProjet,
  GetProjetAggregateRoot,
  IdentifiantProjet,
} from '../../../../index.js';

export type ModifierInstallateurCommand = Message<
  'Lauréat.Installation.Command.ModifierInstallateur',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    installateur: string;
    dateModification: DateTime.ValueType;
    raison: string;
    pièceJustificative?: DocumentProjet.ValueType;
  }
>;

export const registerModifierInstallateurCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierInstallateurCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.installation.modifierInstallateur(payload);
  };
  mediator.register('Lauréat.Installation.Command.ModifierInstallateur', handler);
};
