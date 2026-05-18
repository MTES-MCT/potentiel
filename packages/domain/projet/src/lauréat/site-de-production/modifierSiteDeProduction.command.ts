import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { DateTime, Email } from '@potentiel-domain/common';

import type { Coordonnées, Localité } from '../../candidature/index.js';
import type { DocumentProjet, GetProjetAggregateRoot, IdentifiantProjet } from '../../index.js';

export type ModifierSiteDeProductionCommand = Message<
  'Lauréat.Command.ModifierSiteDeProduction',
  {
    identifiantProjet: IdentifiantProjet.ValueType;
    modifiéLe: DateTime.ValueType;
    modifiéPar: Email.ValueType;
    localité: Localité.ValueType;
    coordonnées?: Coordonnées.ValueType;
    raison: string;
    pièceJustificative: DocumentProjet.ValueType | undefined;
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
