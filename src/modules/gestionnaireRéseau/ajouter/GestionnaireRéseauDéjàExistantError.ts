import { DomainError } from '@core/domain';

export class GestionnaireRéseauDéjàExistantError extends DomainError {
  constructor() {
    super(`Le gestionnaire de réseau existe déjà.`);
  }
}
