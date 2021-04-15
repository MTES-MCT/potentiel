import { DomainError } from '../../../core/domain'

export class UserWithEmailExistsAlreadyError extends DomainError {
  constructor() {
    super(`Un utilisateur avec cette adresse email existe déjà.`)
  }
}
