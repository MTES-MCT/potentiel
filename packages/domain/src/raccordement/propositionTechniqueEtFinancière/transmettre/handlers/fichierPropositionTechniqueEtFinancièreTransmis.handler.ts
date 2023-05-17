import { DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { FichierPropositionTechniqueEtFinancièreTransmisEvent } from '../fichierPropositionTechniqueEtFinancièreTransmis.event';

import { isSome } from '@potentiel/monads';
import { DossierRaccordementReadModel } from '../../../dossierRaccordement/consulter';

export const fichierPropositionTechniqueEtFinancièreTransmisHandlerFactory: DomainEventHandlerFactory<
  FichierPropositionTechniqueEtFinancièreTransmisEvent,
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
          ...(dossierRaccordement.propositionTechniqueEtFinancière && {
            propositionTechniqueEtFinancière: {
              ...dossierRaccordement.propositionTechniqueEtFinancière,
              format: event.payload.format,
            },
          }),
        },
      );
    } else {
      // TODO add a log here
    }
  };
