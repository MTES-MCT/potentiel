import { Message, MessageHandler, mediator } from 'mediateur';
import { Publish, LoadAggregate } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import { DossierRaccordementNonRéférencéError } from '../raccordement.errors';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import { PropositionTechniqueEtFinancièreModifiéeEvent } from '../raccordement.event';
import { RéférenceDossierRaccordement } from '../raccordement.valueType';

export type ModifierPropositionTechniqueEtFinancièreCommand = Message<
  'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND',
  {
    identifiantProjet: IdentifiantProjetValueType;
    dateSignature: Date;
    référenceDossierRaccordement: RéférenceDossierRaccordement;
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

    if (isNone(raccordement) || !raccordement.contientLeDossier(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const propositionTechniqueEtFinancièreModifiée: PropositionTechniqueEtFinancièreModifiéeEvent =
      {
        type: 'PropositionTechniqueEtFinancièreModifiée',
        payload: {
          identifiantProjet: identifiantProjet.formatter(),
          dateSignature: dateSignature.toISOString(),
          référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
        },
      };

    await publish(
      createRaccordementAggregateId(identifiantProjet),
      propositionTechniqueEtFinancièreModifiée,
    );
  };

  mediator.register('MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND', handler);
};
