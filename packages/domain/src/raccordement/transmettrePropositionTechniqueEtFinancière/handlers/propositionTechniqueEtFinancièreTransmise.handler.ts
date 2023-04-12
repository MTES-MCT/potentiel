import { DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { PropositionTechniqueEtFinancièreTransmiseEvent } from '../propositionTechniqueEtFinancièreTransmise.event';
import { DemandeComplèteRaccordementReadModel } from '../../demandeComplèteRaccordement';
import { isSome } from '@potentiel/monads';

export const propositionTechniqueEtFinancièreTransmiseHandlerFactory: DomainEventHandlerFactory<
  PropositionTechniqueEtFinancièreTransmiseEvent,
  {
    find: Find;
    update: Update;
  }
> =
  ({ find, update }) =>
  async (event) => {
    const demandeComplèteRaccordement = await find<DemandeComplèteRaccordementReadModel>(
      `demande-complète-raccordement#${event.payload.référenceDemandeComplèteRaccordement}`,
    );

    if (isSome(demandeComplèteRaccordement)) {
      await update<DemandeComplèteRaccordementReadModel>(
        `demande-complète-raccordement#${event.payload.référenceDemandeComplèteRaccordement}`,
        {
          ...demandeComplèteRaccordement,
          propositionTechniqueEtFinancière: {
            dateSignature: event.payload.dateSignature,
          },
        },
      );
    }
  };
