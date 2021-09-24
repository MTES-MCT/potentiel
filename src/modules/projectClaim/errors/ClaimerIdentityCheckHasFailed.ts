import { DomainError } from '../../../core/domain'

export class ClaimerIdentityCheckHasFailed extends DomainError {
  constructor(remainingAttempts: number) {
    super(
      `Les données que vous avez fournies sont erronées et ne nous permettent pas de vous identifier comme étant le propriétaire du projet. Essai(s) restant(s) : ${remainingAttempts}.`
    )
  }
}
