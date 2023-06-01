import { DomainEventHandlerFactory, Update } from '@potentiel/core-domain';
import { GestionnaireRéseauModifiéEvent } from '../gestionnaireRéseauModifié.event';
import { GestionnaireRéseauReadModel } from '../../../query/gestionnaireRéseau.readModel';

export type GestionnaireRéseauModifiéHandlerDependencies = {
  update: Update;
};

/**
 * @deprecated
 */
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
