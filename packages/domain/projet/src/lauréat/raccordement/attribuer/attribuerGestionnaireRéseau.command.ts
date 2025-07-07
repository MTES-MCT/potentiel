import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

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
