import { Create, Remove, DomainEventHandlerFactory, Find } from '@potentiel/core-domain';
import { isSome } from '@potentiel/monads';
import { DossierRaccordementReadModel } from '../../consulter/dossierRaccordement.readModel';
import { DemandeComplèteRaccordementModifiéeEvent } from '../DemandeComplèteRaccordementModifiée.event';

export const demandeComplèteRaccordementeModifiéeHandlerFactory: DomainEventHandlerFactory<
  DemandeComplèteRaccordementModifiéeEvent,
  {
    find: Find;
    create: Create;
    remove: Remove;
  }
> =
  ({ find, create, remove }) =>
  async (event) => {
    const dossierRaccordement = await find<DossierRaccordementReadModel>(
      `dossier-raccordement#${event.payload.referenceActuelle}`,
    );

    if (isSome(dossierRaccordement)) {
      await create<DossierRaccordementReadModel>(
        `dossier-raccordement#${event.payload.nouvelleReference}`,
        {
          ...dossierRaccordement,
          dateQualification: event.payload.dateQualification,
          référence: event.payload.nouvelleReference,
        },
      );

      await remove<DossierRaccordementReadModel>(
        `dossier-raccordement#${event.payload.referenceActuelle}`,
      );
    } else {
      // TODO add a log here
    }
  };
