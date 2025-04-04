import { Message, MessageHandler, mediator } from 'mediateur';

import { LoadAggregate } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { loadLauréatFactory } from '../lauréat.aggregate';

export type ModifierCahierDesChargesCommand = Message<
  'Lauréat.Command.ModifierCahierDesCharges',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    modifiéLe: DateTime.ValueType;
    modifiéPar: Email.ValueType;
    // TODO convert to valueType
    cahierDesCharges: AppelOffre.CahierDesChargesRéférence;
  }
>;

export const registerModifierCahierDesChargesCommand = (loadAggregate: LoadAggregate) => {
  const loadLauréatAggregate = loadLauréatFactory(loadAggregate);

  const handler: MessageHandler<ModifierCahierDesChargesCommand> = async (payload) => {
    const lauréat = await loadLauréatAggregate(payload.identifiantProjet, false);

    await lauréat.modifierCahierDesCharges(payload);
  };
  mediator.register('Lauréat.Command.ModifierCahierDesCharges', handler);
};
