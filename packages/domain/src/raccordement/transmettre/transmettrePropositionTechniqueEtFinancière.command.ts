import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import { DossierRaccordementNonRéférencéError } from '../raccordement.errors';
import { PropositionTechniqueEtFinancièreTransmiseEvent } from '../raccordement.event';
import { RéférenceDossierRaccordementValueType } from '../raccordement.valueType';

export type TransmettrePropositionTechniqueEtFinancièreCommand = Message<
  'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND',
  {
    dateSignature: Date;
    référenceDossierRaccordement: RéférenceDossierRaccordementValueType;
    identifiantProjet: IdentifiantProjetValueType;
  }
>;

export type TransmettrePropositionTechniqueEtFinancièreDependencies = {
  loadAggregate: LoadAggregate;
  publish: Publish;
};

export const registerTransmettrePropositionTechniqueEtFinancièreCommand = ({
  publish,
  loadAggregate,
}: TransmettrePropositionTechniqueEtFinancièreDependencies) => {
  const loadRaccordementAggregate = loadRaccordementAggregateFactory({
    loadAggregate,
  });
  const handler: MessageHandler<TransmettrePropositionTechniqueEtFinancièreCommand> = async ({
    dateSignature,
    référenceDossierRaccordement,
    identifiantProjet,
  }) => {
    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.contientLeDossier(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const propositionTechniqueEtFinancièreTransmise: PropositionTechniqueEtFinancièreTransmiseEvent =
      {
        type: 'PropositionTechniqueEtFinancièreTransmise',
        payload: {
          dateSignature: dateSignature.toISOString(),
          référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
          identifiantProjet: identifiantProjet.formatter(),
        },
      };

    await publish(
      createRaccordementAggregateId(identifiantProjet),
      propositionTechniqueEtFinancièreTransmise,
    );
  };

  mediator.register('TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND', handler);
};
