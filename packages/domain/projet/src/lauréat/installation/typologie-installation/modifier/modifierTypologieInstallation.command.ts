import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../../..';
import { TypologieInstallation } from '../../../../candidature';

export type ModifierTypologieInstallationCommand = Message<
  'Lauréat.Installation.Command.ModifierTypologieInstallation',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    identifiantUtilisateur: Email.ValueType;
    typologieInstallation: TypologieInstallation.ValueType[];
    dateModification: DateTime.ValueType;
    raison?: string;
    pièceJustificative?: DocumentProjet.ValueType;
  }
>;

export const registerModifierTypologieInstallationCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierTypologieInstallationCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);
    await projet.lauréat.installation.modifierTypologieInstallation(payload);
  };
  mediator.register('Lauréat.Installation.Command.ModifierTypologieInstallation', handler);
};
