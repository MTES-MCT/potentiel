import { DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { PropositionTechniqueEtFinancièreTransmiseEvent } from '../propositionTechniqueEtFinancièreTransmise.event';

import { isSome } from '@potentiel/monads';
import { DossierRaccordementReadModel } from '../../consulter/dossierRaccordement.readModel';

export const propositionTechniqueEtFinancièreTransmiseHandlerFactory: DomainEventHandlerFactory<
  PropositionTechniqueEtFinancièreTransmiseEvent,
  {
    find: Find;
    update: Update;
  }
> =
  ({ find, update }) =>
  async (event) => {
    const demandeComplèteRaccordement = await find<DossierRaccordementReadModel>(
      `dossier-raccordement#${event.payload.référenceDossierRaccordement}`,
    );

    if (isSome(demandeComplèteRaccordement)) {
      await update<DossierRaccordementReadModel>(
        `dossier-raccordement#${event.payload.référenceDossierRaccordement}`,
        {
          ...demandeComplèteRaccordement,
          propositionTechniqueEtFinancière: {
            dateSignature: event.payload.dateSignature,
          },
        },
      );
    }
  };
