import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { LoadAggregate } from '@potentiel-domain/core';

import { GetProjetAggregateRoot } from '../../..';

export type AttribuerGestionnaireRéseauCommand = Message<
  'Lauréat.Raccordement.Command.AttribuerGestionnaireRéseau',
  {
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAttribuerGestionnaireCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
  loadAggregate: LoadAggregate,
) => {
  const loadGestionnaireRéseau = GestionnaireRéseau.loadGestionnaireRéseauFactory(loadAggregate);

  const handler: MessageHandler<AttribuerGestionnaireRéseauCommand> = async (options) => {
    const gestionnaireRéseau = await loadGestionnaireRéseau(options.identifiantGestionnaireRéseau);

    const projet = await getProjetAggregateRoot(options.identifiantProjet);

    await projet.lauréat.raccordement.attribuerGestionnaireRéseau({
      identifiantGestionnaireRéseau: gestionnaireRéseau.identifiantGestionnaireRéseau,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.AttribuerGestionnaireRéseau', handler);
};
