import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Publish, LoadAggregate } from '@potentiel/core-domain';
import { PropositionTechniqueEtFinancièreModifiéeEvent } from './propositionTechniqueEtFinancièreModifiée.event';
import { isNone } from '@potentiel/monads';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../../raccordement.aggregate';
import { DossierRaccordementNonRéférencéError } from '../../raccordement.errors';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';

export type ModifierPropositionTechniqueEtFinancièreCommand = Message<
  'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND',
  {
    identifiantProjet: IdentifiantProjet;
    dateSignature: Date;
    référenceDossierRaccordement: string;
  }
>;

export type ModifierPropositionTechniqueEtFinancièreDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
};

export const registerModifierPropositionTechniqueEtFinancièreCommand = ({
  publish,
  loadAggregate,
}: ModifierPropositionTechniqueEtFinancièreDependencies) => {
  const handler: MessageHandler<ModifierPropositionTechniqueEtFinancièreCommand> = async ({
    identifiantProjet,
    référenceDossierRaccordement,
    dateSignature,
  }) => {
    const loadRaccordementAggregate = loadRaccordementAggregateFactory({
      loadAggregate,
    });

    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.références.includes(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const propositionTechniqueEtFinancièreModifiéeEvent: PropositionTechniqueEtFinancièreModifiéeEvent =
      {
        type: 'PropositionTechniqueEtFinancièreModifiée',
        payload: {
          identifiantProjet: formatIdentifiantProjet(identifiantProjet),
          dateSignature: dateSignature.toISOString(),
          référenceDossierRaccordement: référenceDossierRaccordement,
        },
      };

    await publish(
      createRaccordementAggregateId(identifiantProjet),
      propositionTechniqueEtFinancièreModifiéeEvent,
    );
  };

  mediator.register('MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND', handler);
};

export const buildModifierPropositionTechniqueEtFinancièreCommand =
  getMessageBuilder<ModifierPropositionTechniqueEtFinancièreCommand>(
    'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND',
  );
