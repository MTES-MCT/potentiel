import { type Message, type MessageHandler, mediator } from 'mediateur';

import type { GestionnaireRéseau } from '@potentiel-domain/reseau';

import type { GetProjetAggregateRoot, IdentifiantProjet } from '../../../index.js';

export type AttribuerGestionnaireRéseauCommand = Message<
  'Lauréat.Raccordement.Command.AttribuerGestionnaireRéseau',
  {
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
    identifiantProjet: IdentifiantProjet.ValueType;
  }
>;

export const registerAttribuerGestionnaireCommand = (
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<AttribuerGestionnaireRéseauCommand> = async ({
    identifiantProjet,
    identifiantGestionnaireRéseau,
  }) => {
    const projet = await getProjetAggregateRoot(identifiantProjet);

    await projet.lauréat.raccordement.attribuerGestionnaireRéseau({
      identifiantGestionnaireRéseau,
    });
  };

  mediator.register('Lauréat.Raccordement.Command.AttribuerGestionnaireRéseau', handler);
};
