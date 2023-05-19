import { Create, Remove, DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { DemandeComplèteRaccordementModifiéeEvent } from '../demandeComplèteRaccordementModifiée.event';
import { ListeDossiersRaccordementReadModel } from '../../../dossierRaccordement/lister/listeDossierRaccordement.readModel';
import { DossierRaccordementReadModel } from '../../../dossierRaccordement/dossierRaccordement.readModel';

export type DemandeComplèteRaccordementeModifiéeDependencies = {
  find: Find;
  create: Create;
  remove: Remove;
  update: Update;
};

export const demandeComplèteRaccordementeModifiéeHandlerFactory: DomainEventHandlerFactory<
  DemandeComplèteRaccordementModifiéeEvent,
  DemandeComplèteRaccordementeModifiéeDependencies
> =
  ({ find, create, remove, update }) =>
  async (event) => {
    const dossierRaccordement = await find<DossierRaccordementReadModel>(
      `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.referenceActuelle}`,
    );

    if (isNone(dossierRaccordement)) {
      // TODO ajouter un log ici
      return;
    }

    await create<DossierRaccordementReadModel>(
      `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.nouvelleReference}`,
      {
        ...dossierRaccordement,
        dateQualification: event.payload.dateQualification,
        référence: event.payload.nouvelleReference,
      },
    );

    await remove<DossierRaccordementReadModel>(
      `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.referenceActuelle}`,
    );

    const listeDossierRaccordement = await find<ListeDossiersRaccordementReadModel>(
      `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
    );

    if (isNone(listeDossierRaccordement)) {
      // TODO ajouter un log ici
      return;
    }

    await update<ListeDossiersRaccordementReadModel>(
      `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
      {
        ...listeDossierRaccordement,
        références: [
          ...listeDossierRaccordement.références.filter(
            (référence) => référence !== event.payload.referenceActuelle,
          ),
          event.payload.nouvelleReference,
        ],
      },
    );
  };
