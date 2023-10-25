import { Message, MessageHandler, mediator } from 'mediateur';
import { Publish, LoadAggregate } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import { DateDansLeFuturError, DossierRaccordementNonRéférencéError } from '../raccordement.errors';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import { PropositionTechniqueEtFinancièreModifiéeEventV1 } from '../raccordement.event';
import { RéférenceDossierRaccordementValueType } from '../raccordement.valueType';
import { DateTimeValueType } from '../../common/common.valueType';

export type ModifierPropositionTechniqueEtFinancièreCommand = Message<
  'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND',
  {
    identifiantProjet: IdentifiantProjetValueType;
    dateSignature: DateTimeValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordementValueType;
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
    if (dateSignature.estDansLeFutur()) {
      throw new DateDansLeFuturError();
    }

    const loadRaccordementAggregate = loadRaccordementAggregateFactory({
      loadAggregate,
    });

    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.contientLeDossier(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const propositionTechniqueEtFinancièreModifiée: PropositionTechniqueEtFinancièreModifiéeEventV1 =
      {
        type: 'PropositionTechniqueEtFinancièreModifiée-V1',
        payload: {
          identifiantProjet: identifiantProjet.formatter(),
          dateSignature: dateSignature.formatter(),
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
