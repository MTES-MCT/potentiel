import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';

import * as IdentifiantGestionnaireRéseau from '../../gestionnaire/identifiantGestionnaireRéseau.valueType';
import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';
import { loadGestionnaireRéseauFactory } from '../../gestionnaire/gestionnaireRéseau.aggregate';

export type AttribuerGestionnaireRéseauCommand = Message<
  'Réseau.Raccordement.Command.AttribuerGestionnaireRéseau',
  {
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAttribuerGestionnaireCommand = (loadAggregate: LoadAggregate) => {
  const loadRaccordement = loadRaccordementAggregateFactory(loadAggregate);
  const loadGestionnaire = loadGestionnaireRéseauFactory(loadAggregate);

  const handler: MessageHandler<AttribuerGestionnaireRéseauCommand> = async ({
    identifiantGestionnaireRéseau,
    identifiantProjet,
  }) => {
    const gestionnaire = await loadGestionnaire(identifiantGestionnaireRéseau);
    const raccordement = await loadRaccordement(identifiantProjet, false);

    await raccordement.attribuerGestionnaireRéseau({
      identifiantGestionnaireRéseau: gestionnaire.identifiantGestionnaireRéseau,
      identifiantProjet: identifiantProjet,
    });
  };

  mediator.register('Réseau.Raccordement.Command.AttribuerGestionnaireRéseau', handler);
};
