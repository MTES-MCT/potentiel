import { Create, DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { DemandeComplèteRaccordementTransmiseEvent } from '../demandeComplèteRaccordementTransmise.event';
import { ProjetReadModel } from '../../../../projet';
import { ListeDossiersRaccordementReadModel } from '../../../dossierRaccordement/lister/listeDossierRaccordement.readModel';
import { DossierRaccordementReadModel } from '../../../dossierRaccordement/consulter/dossierRaccordement.readModel';

export type DemandeComplèteRaccordementTransmiseHandlerFactoryDependencies = {
  create: Create;
  update: Update;
  find: Find;
};

/**
 * @deprecated
 */
export const demandeComplèteRaccordementTransmiseHandlerFactory: DomainEventHandlerFactory<
  DemandeComplèteRaccordementTransmiseEvent,
  DemandeComplèteRaccordementTransmiseHandlerFactoryDependencies
> =
  ({ create, update, find }) =>
  async (event) => {
    await create<DossierRaccordementReadModel>(
      `dossier-raccordement#${event.payload.identifiantProjet}#${event.payload.référenceDossierRaccordement}`,
      {
        dateQualification: event.payload.dateQualification,
        référence: event.payload.référenceDossierRaccordement,
      },
    );

    const listeDossierRaccordement = await find<ListeDossiersRaccordementReadModel>(
      `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
    );

    if (isNone(listeDossierRaccordement)) {
      await create<ListeDossiersRaccordementReadModel>(
        `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
        {
          références: [event.payload.référenceDossierRaccordement],
        },
      );
    } else {
      await update<ListeDossiersRaccordementReadModel>(
        `liste-dossiers-raccordement#${event.payload.identifiantProjet}`,
        {
          ...listeDossierRaccordement,
          références: [
            ...listeDossierRaccordement.références,
            event.payload.référenceDossierRaccordement,
          ],
        },
      );
    }

    const projetKey: `projet#${string}` = `projet#${event.payload.identifiantProjet}`;
    const projet = await find<ProjetReadModel>(projetKey);

    // TODO : est-ce qu'on émettrait pas un event GestionnaireRéseauProjetModifiéEvent ici plutôt ?
    if (isNone(projet)) {
      await create<ProjetReadModel>(projetKey, {
        identifiantGestionnaire: {
          codeEIC: event.payload.identifiantGestionnaireRéseau,
        },
      });
    } else {
      await update<ProjetReadModel>(projetKey, {
        identifiantGestionnaire: {
          codeEIC: event.payload.identifiantGestionnaireRéseau,
        },
      });
    }
  };
