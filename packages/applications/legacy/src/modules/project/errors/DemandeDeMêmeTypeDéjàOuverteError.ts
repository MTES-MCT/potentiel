import { DomainError } from '../../../core/domain';

export class DemandeDeMêmeTypeDéjàOuverteError extends DomainError {
  constructor() {
    super(
      `Une demande de même type faite dans Potentiel est en attente de réponse. Nous vous invitons à clore cette demande avant d'en signaler une nouvelle.`,
    );
  }
}
