import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import { DateDansLeFuturError, DossierRaccordementNonRéférencéError } from '../raccordement.errors';
import { PropositionTechniqueEtFinancièreTransmiseEvent } from '../raccordement.event';
import { RéférenceDossierRaccordementValueType } from '../raccordement.valueType';
import { DateTimeValueType } from '../../common.valueType';

export type TransmettrePropositionTechniqueEtFinancièreCommand = Message<
  'TRANSMETTRE_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_COMMAND',
  {
    dateSignature: DateTimeValueType;
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
    if (dateSignature.estDansLeFutur()) {
      throw new DateDansLeFuturError();
    }

    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.contientLeDossier(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const propositionTechniqueEtFinancièreTransmise: PropositionTechniqueEtFinancièreTransmiseEvent =
      {
        type: 'PropositionTechniqueEtFinancièreTransmise',
        payload: {
          dateSignature: dateSignature.formatter(),
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
