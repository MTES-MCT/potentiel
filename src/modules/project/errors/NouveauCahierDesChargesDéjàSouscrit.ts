import { DomainError } from '@core/domain'

export class NouveauCahierDesChargesDéjàSouscrit extends DomainError {
  constructor() {
    super('Le nouveau cahier des charges est déjà souscrit pour ce projet')
  }
}
