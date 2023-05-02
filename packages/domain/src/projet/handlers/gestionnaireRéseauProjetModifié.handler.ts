import { Create, DomainEventHandlerFactory, Find, Update } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import { GestionnaireRéseauProjetModifiéEvent } from '../../raccordement/modifierGestionnaireRéseauProjet/modifierGestionnaireRéseauProjet.event';
import { ProjetReadModel } from '../projet.readModel';

export const gestionnaireRéseauProjetModifiéHandlerFactory: DomainEventHandlerFactory<
  GestionnaireRéseauProjetModifiéEvent,
  {
    create: Create;
    update: Update;
    find: Find;
  }
> =
  ({ create, update, find }) =>
  async (event) => {
    const projetKey: `projet#${string}` = `projet#${event.payload.identifiantProjet}`;
    const projet = await find<ProjetReadModel>(projetKey);

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
