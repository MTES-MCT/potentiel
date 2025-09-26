import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';

import { GetProjetAggregateRoot, IdentifiantProjet } from '../..';
import { Localité } from '../../candidature';

export type ModifierSiteDeProductionCommand = Message<
  'Lauréat.Command.ModifierSiteDeProduction',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    modifiéLe: DateTime.ValueType;
    modifiéPar: Email.ValueType;
    localité: Localité.ValueType;
  }
>;

export const registerModifierSiteDeProductionCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<ModifierSiteDeProductionCommand> = async (payload) => {
    const projet = await getProjetAggregateRoot(payload.identifiantProjet);

    await projet.lauréat.modifierSiteDeProduction(payload);
  };
  mediator.register('Lauréat.Command.ModifierSiteDeProduction', handler);
};
