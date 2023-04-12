import { DomainEventHandlerFactory, Update } from '@potentiel/core-domain';
import { GestionnaireRéseauModifiéEvent } from '../gestionnaireRéseauModifié.event';
import { GestionnaireRéseauReadModel } from '../../gestionnaireRéseau.readModel';

type GestionnaireRéseauModifiéHandlerDependencies = {
  update: Update;
};

export const gestionnaireRéseauModifiéHandlerFactory: DomainEventHandlerFactory<
  GestionnaireRéseauModifiéEvent,
  GestionnaireRéseauModifiéHandlerDependencies
> =
  ({ update }) =>
  async (event) => {
    await update<GestionnaireRéseauReadModel>(`gestionnaire-réseau#${event.payload.codeEIC}`, {
      ...event.payload,
    });
  };
