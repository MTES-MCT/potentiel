import { DomainError } from '@core/domain'

export class ImportDateMiseEnServiceManquanteError extends DomainError {
  constructor(numéroDeLigne: number) {
    super(`Date de mise en service manquante à la ligne ${numéroDeLigne.toString()}`)
  }
}
