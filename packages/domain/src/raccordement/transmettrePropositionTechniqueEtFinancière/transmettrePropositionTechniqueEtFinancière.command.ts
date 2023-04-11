import { CommandHandlerFactory, LoadAggregate, Publish } from '@potentiel/core-domain';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import { PropositionTechniqueEtFinancièreTransmiseEvent } from './propositionTechniqueEtFinancièreTransmise.event';

type Dependencies = { loadAggregate: LoadAggregate; publish: Publish };

type TransmettrePropositionTechniqueEtFinancièreCommand = {
  dateSignature: Date;
  référenceDemandeComplèteRaccordement: string;
  identifiantProjet: IdentifiantProjet;
};

export const transmettrePropositionTechniqueEtFinancièreCommandHandlerFactory: CommandHandlerFactory<
  TransmettrePropositionTechniqueEtFinancièreCommand,
  Dependencies
> =
  ({ loadAggregate, publish }) =>
  ({ dateSignature, référenceDemandeComplèteRaccordement, identifiantProjet }) => {
    const event: PropositionTechniqueEtFinancièreTransmiseEvent = {
      type: 'PropositionTechniqueEtFinancièreTransmise',
      payload: {
        dateSignature: dateSignature.toISOString(),
        référenceDemandeComplèteRaccordement,
        identifiantProjet: formatIdentifiantProjet(identifiantProjet),
      },
    };
  };
