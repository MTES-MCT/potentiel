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
    const dossierRaccordement = await find<DossierRaccordementReadModel>(
      `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
    );

    if (isSome(dossierRaccordement)) {
      await update<DossierRaccordementReadModel>(
        `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
        {
          ...dossierRaccordement,
          propositionTechniqueEtFinancière: {
            dateSignature: event.payload.dateSignature,
          },
        },
      );
    } else {
      // TODO add a log here
    }
  };
