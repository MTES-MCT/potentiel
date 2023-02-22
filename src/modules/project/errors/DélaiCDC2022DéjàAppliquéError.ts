import { DomainError } from '@core/domain';

export class DélaiCDC2022DéjàAppliquéError extends DomainError {
  constructor() {
    super(`Le délai relatif au cahier des charges du 30/08/22 a déjà été appliqué sur ce projet.`);
  }
}
