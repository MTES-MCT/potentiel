import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { loadRaccordementAggregateFactory } from '../raccordement.aggregate';

export type AttribuerGestionnaireRéseauCommand = Message<
  'Réseau.Raccordement.Command.AttribuerGestionnaireRéseau',
  {
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAttribuerGestionnaireCommand = (loadAggregate: LoadAggregate) => {
  const loadRaccordement = loadRaccordementAggregateFactory(loadAggregate);
  const loadGestionnaireRéseau = GestionnaireRéseau.loadGestionnaireRéseauFactory(loadAggregate);

  const handler: MessageHandler<AttribuerGestionnaireRéseauCommand> = async ({
    identifiantProjet,
    identifiantGestionnaireRéseau,
  }) => {
    const gestionnaireRéseau = await loadGestionnaireRéseau(identifiantGestionnaireRéseau);
    const raccordement = await loadRaccordement(identifiantProjet, false);

    await raccordement.attribuerGestionnaireRéseau({
      identifiantProjet,
      identifiantGestionnaireRéseau: gestionnaireRéseau.identifiantGestionnaireRéseau,
    });
  };

  mediator.register('Réseau.Raccordement.Command.AttribuerGestionnaireRéseau', handler);
};
