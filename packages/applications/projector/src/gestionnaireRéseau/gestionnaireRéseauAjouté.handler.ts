import { DomainEventHandler } from '@potentiel/core-domain';
import {
  ConsulterGestionnaireRéseauReadModel,
  GestionnaireRéseauAjoutéEvent,
} from '@potentiel/domain';
export const gestionnaireRéseauAjoutéHandler: DomainEventHandler<
  GestionnaireRéseauAjoutéEvent
> = async (event) => {
  const gestionnaireRéseau: ConsulterGestionnaireRéseauReadModel = { ...event.payload };
};
