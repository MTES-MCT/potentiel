import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../..';
import { StatutLauréat } from '..';

export type ModifierStatutLauréatCommand = Message<
  'Lauréat.Command.ModifierStatut',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    modifiéLe: DateTime.ValueType;
    modifiéPar: Email.ValueType;
    statut: StatutLauréat.ValueType;
  }
>;

export const registerModifierStatutLauréatCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierStatutLauréatCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);

    await projet.lauréat.modifierStatut(payload);
  };
  mediator.register('Lauréat.Command.ModifierStatut', handler);
};
