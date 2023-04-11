import { DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { PropositionTechniqueEtFinancièreTransmiseEvent } from '../propositionTechniqueEtFinancièreTransmise.event';
import { DemandeComplèteRaccordementReadModel } from '../../demandeComplèteRaccordement';
import { isSome } from '@potentiel/monads';

export const propositionTechniqueEtFinancièreTransmiseHandlerFactory: DomainEventHandlerFactory<
  PropositionTechniqueEtFinancièreTransmiseEvent,
  {
    findDemandeComplèteRaccordement: Find<DemandeComplèteRaccordementReadModel>;
    updateDemandeComplèteRaccordement: Update<DemandeComplèteRaccordementReadModel>;
  }
> =
  ({ findDemandeComplèteRaccordement, updateDemandeComplèteRaccordement }) =>
  async (event) => {
    const demandeComplèteRaccordement = await findDemandeComplèteRaccordement(
      `demande-complète-raccordement#${event.payload.référenceDemandeComplèteRaccordement}`,
    );

    if (isSome(demandeComplèteRaccordement)) {
      await updateDemandeComplèteRaccordement(
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
