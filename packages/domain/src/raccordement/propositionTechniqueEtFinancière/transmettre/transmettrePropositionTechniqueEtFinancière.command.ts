import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { PropositionTechniqueEtFinancièreTransmiseEvent } from './propositionTechniqueEtFinancièreTransmise.event';
import { isNone } from '@potentiel/monads';
import {
  loadRaccordementAggregateFactory,
  createRaccordementAggregateId,
} from '../../raccordement.aggregate';
import { DossierRaccordementNonRéférencéError } from '../../raccordement.errors';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';

const TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND = Symbol(
  'MODIFIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND',
);

export type TransmettrePropositionTechniqueEtFinancièreCommand = Message<
  typeof TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND,
  {
    dateSignature: Date;
    référenceDossierRaccordement: string;
    identifiantProjet: IdentifiantProjet;
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
  const handler: MessageHandler<TransmettrePropositionTechniqueEtFinancièreCommand> = async ({
    dateSignature,
    référenceDossierRaccordement,
    identifiantProjet,
  }) => {
    const loadRaccordementAggregate = loadRaccordementAggregateFactory({
      loadAggregate,
    });

    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.références.includes(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const propositionTechniqueEtFinancièreTransmiseEvent: PropositionTechniqueEtFinancièreTransmiseEvent =
      {
        type: 'PropositionTechniqueEtFinancièreTransmise',
        payload: {
          dateSignature: dateSignature.toISOString(),
          référenceDossierRaccordement,
          identifiantProjet: formatIdentifiantProjet(identifiantProjet),
        },
      };

    await publish(
      createRaccordementAggregateId(identifiantProjet),
      propositionTechniqueEtFinancièreTransmiseEvent,
    );
  };

  mediator.register(TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND, handler);
};

export const buildTransmettrePropositionTechniqueEtFinancièreCommand =
  getMessageBuilder<TransmettrePropositionTechniqueEtFinancièreCommand>(
    TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND,
  );
