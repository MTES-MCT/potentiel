import { DomainEventHandlerFactory, Update } from '@potentiel/core-domain';
import { GestionnaireRéseauReadModel } from '../../gestionnaireRéseau.readModel';
import { GestionnaireRéseauModifiéEvent } from '../gestionnaireRéseauModifié.event';

type GestionnaireRéseauModifiéHandlerDependencies = {
  update: Update<GestionnaireRéseauReadModel>;
};

export const gestionnaireRéseauModifiéHandlerFactory: DomainEventHandlerFactory<
  GestionnaireRéseauModifiéEvent,
  GestionnaireRéseauModifiéHandlerDependencies
> =
  ({ update }) =>
  async (event) => {
    await update(`gestionnaire-réseau#${event.payload.codeEIC}`, { ...event.payload });
  };
