import { CommandHandlerFactory, Publish } from '@potentiel/core-domain';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import { GestionnaireRéseauProjetModifiéEvent } from './modifierGestionnaireRéseauProjet.event';
import { createProjetAggregateId } from '../../projet/projet.aggregate';

type Dependencies = { publish: Publish };

type modifierGestionnaireRéseauProjetCommand = {
  identifiantGestionnaireRéseau: string;
  identifiantProjet: IdentifiantProjet;
};

export const modifierGestionnaireRéseauProjetCommandHandlerFactory: CommandHandlerFactory<
  modifierGestionnaireRéseauProjetCommand,
  Dependencies
> =
  ({ publish }) =>
  async ({ identifiantProjet, identifiantGestionnaireRéseau }) => {
    const event: GestionnaireRéseauProjetModifiéEvent = {
      type: 'GestionnaireRéseauProjetModifié',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        identifiantGestionnaireRéseau,
      },
    };

    await publish(createProjetAggregateId(identifiantProjet), event);
  };
