import { CommandHandlerFactory, LoadAggregate, Publish } from '@potentiel/core-domain';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import { PropositionTechniqueEtFinancièreTransmiseEvent } from './propositionTechniqueEtFinancièreTransmise.event';
import { createRaccordementAggregateId } from '../raccordement.aggregate';

type Dependencies = { loadAggregate: LoadAggregate; publish: Publish };

type TransmettrePropositionTechniqueEtFinancièreCommand = {
  dateSignature: Date;
  référenceDossierRaccordement: string;
  identifiantProjet: IdentifiantProjet;
};

export const transmettrePropositionTechniqueEtFinancièreCommandHandlerFactory: CommandHandlerFactory<
  TransmettrePropositionTechniqueEtFinancièreCommand,
  Dependencies
> =
  ({ publish }) =>
  async ({ dateSignature, référenceDossierRaccordement, identifiantProjet }) => {
    const event: PropositionTechniqueEtFinancièreTransmiseEvent = {
      type: 'PropositionTechniqueEtFinancièreTransmise',
      payload: {
        dateSignature: dateSignature.toISOString(),
        référenceDossierRaccordement,
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
      },
    };

    await publish(createRaccordementAggregateId(identifiantProjet), event);
  };
