import { DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { isSome } from '@potentiel/monads';
import { DossierRaccordementReadModel } from '../../consulter/dossierRaccordement.readModel';
import { DemandeComplèteRaccordementModifiéeEvent } from '../DemandeComplèteRaccordementModifiée.event';

export const demandeComplèteRaccordementeModifiéeHandlerFactory: DomainEventHandlerFactory<
  DemandeComplèteRaccordementModifiéeEvent,
  {
    find: Find;
    update: Update;
  }
> =
  ({ find, update }) =>
  async (event) => {
    const dossierRaccordement = await find<DossierRaccordementReadModel>(
      `dossier-raccordement#${event.payload.referenceActuelle}`,
    );

    if (isSome(dossierRaccordement)) {
      await update<DossierRaccordementReadModel>(
        `dossier-raccordement#${event.payload.referenceActuelle}`,
        {
          ...dossierRaccordement,
          dateQualification: event.payload.dateQualification,
          référence: event.payload.nouvelleReference,
        },
      );
    } else {
      // TODO add a log here
    }
  };
