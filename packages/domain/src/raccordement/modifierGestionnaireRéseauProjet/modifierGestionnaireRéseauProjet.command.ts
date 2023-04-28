import { CommandHandlerFactory, LoadAggregate, Publish } from '@potentiel/core-domain';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import { createRaccordementAggregateId } from '../raccordement.aggregate';
import { isNone } from '@potentiel/monads';
import { GestionnaireRéseauProjetModifiéEvent } from './modifierGestionnaireRéseauProjet.event';
import { ProjetNonRéférencéError } from '../../projet/projet.errors';
import { loadProjetAggregateFactory } from '../../projet/projet.aggregate';

type Dependencies = { loadAggregate: LoadAggregate; publish: Publish };

type modifierGestionnaireRéseauProjetCommand = {
  identifiantGestionnaireRéseau: string;
  identifiantProjet: IdentifiantProjet;
};

export const modifierGestionnaireRéseauProjetCommandHandlerFactory: CommandHandlerFactory<
  modifierGestionnaireRéseauProjetCommand,
  Dependencies
> =
  ({ loadAggregate, publish }) =>
  async ({ identifiantProjet, identifiantGestionnaireRéseau }) => {
    const loadProjetAggregate = loadProjetAggregateFactory({
      loadAggregate,
    });

    const projet = await loadProjetAggregate(identifiantProjet);

    if (isNone(projet)) {
      throw new ProjetNonRéférencéError();
    }

    const event: GestionnaireRéseauProjetModifiéEvent = {
      type: 'GestionnaireRéseauProjetModifié',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        identifiantGestionnaireRéseau,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), event);
  };
