import { DomainError } from '@core/domain'

export class ImpossibleDAppliquerDélaiSiCDC2022NonChoisiError extends DomainError {
  constructor() {
    super(
      `Vous ne pouvez pas appliquer ce délai car le porteur de projet n'a pas choisi le cahier des charges du 30/08/2022.`
    )
  }
}
