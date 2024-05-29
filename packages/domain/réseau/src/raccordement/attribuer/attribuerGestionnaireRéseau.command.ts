import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Message, MessageHandler, mediator } from 'mediateur';

import * as IdentifiantGestionnaireRéseau from '../../gestionnaire/identifiantGestionnaireRéseau.valueType';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';

export type AttribuerGestionnaireRéseauCommand = Message<
  'Réseau.Raccordement.Command.AttribuerGestionnaireRéseau',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAttribuerGestionnaireCommand = (loadAggregate: LoadAggregate) => {
  const loadRaccordement = loadRaccordementAggregateFactory(loadAggregate);

  const handler: MessageHandler<AttribuerGestionnaireRéseauCommand> = async ({
    identifiantGestionnaireRéseau,
    identifiantProjet,
  }) => {
    const raccordement = await loadRaccordement(identifiantProjet, false);

    await raccordement.attribuerGestionnaireRéseau({
      identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
      identifiantProjet: identifiantProjet.formatter(),
    });
  };

  mediator.register('Réseau.Raccordement.Command.AttribuerGestionnaireRéseau', handler);
};
