import { DomainError } from '@core/domain';

export class GestionnaireRéseauDéjàExistantError extends DomainError {
  constructor() {
    super(`Un gestionnaire de réseau est déjà enregistré avec ce code EIC.`);
  }
}
