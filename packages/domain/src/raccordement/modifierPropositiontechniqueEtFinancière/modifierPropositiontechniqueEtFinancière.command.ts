import { Publish, LoadAggregate, CommandHandlerFactory } from '@potentiel/core-domain';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import {
  loadRaccordementAggregateFactory,
  createRaccordementAggregateId,
} from '../raccordement.aggregate';
import { PropositionTechniqueEtFinancièreModifiéeEvent } from './PropositionTechniqueEtFinancièreModifiée.event';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementNonRéférencéError } from '../raccordement.errors';

type ModifierPropositionTechniqueEtFinancièreCommand = {
  identifiantProjet: IdentifiantProjet;
  dateSignature: Date;
  référenceDossierRaccordement: string;
};

type ModifierPropositionTechniqueEtFinancièreDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const modifierPropositionTechniqueEtFinancièreCommandHandlerFactory: CommandHandlerFactory<
  ModifierPropositionTechniqueEtFinancièreCommand,
  ModifierPropositionTechniqueEtFinancièreDependencies
> =
  ({ publish, loadAggregate }) =>
  async ({ identifiantProjet, référenceDossierRaccordement, dateSignature }) => {
    const loadRaccordementAggregate = loadRaccordementAggregateFactory({
      loadAggregate,
    });

    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.références.includes(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const event: PropositionTechniqueEtFinancièreModifiéeEvent = {
      type: 'PropositionTechniqueEtFinancièreModifiée',
      payload: {
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        dateSignature: dateSignature.toISOString(),
        référenceDossierRaccordement,
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), event);
  };
