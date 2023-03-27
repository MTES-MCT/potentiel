import { DomainEventHandler, Update } from '@potentiel/core-domain';
import {
  GestionnaireRéseauReadModel,
} from '../../gestionnaireRéseau.readModel';
import { GestionnaireRéseauModifiéEvent } from '../gestionnaireRéseauModifié.event';

export const gestionnaireRéseauModifiéHandlerFactory =
  (
    update: Update<GestionnaireRéseauReadModel>,
  ): DomainEventHandler<GestionnaireRéseauModifiéEvent> =>
  async (event) => {
    await update(`gestionnaire-réseau#${event.payload.codeEIC}`, { ...event.payload });
  };
