import { DomainError } from '@core/domain'

export class ImportDateMiseEnServiceMauvaisFormatError extends DomainError {
  constructor(numéroDeLigne: number) {
    super(
      `Date de mise en service au mauvais à la ligne ${numéroDeLigne.toString()}. Le format attendu est JJ/MM/AAAA (exemple: 01/01/2021)`
    )
  }
}
