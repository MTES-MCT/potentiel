import { DomainError } from '../../../core/domain';

export class NouveauCahierDesChargesDéjàSouscrit extends DomainError {
  constructor() {
    super('Ce cahier des charges est déjà souscrit pour ce projet');
  }
}
