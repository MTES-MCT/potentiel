import { DomainError } from '../../../core/domain';

export class ChampFournisseurManquantError extends DomainError {
  constructor() {
    super('Vous devez renseigner au moins un nouveau fournisseur.');
  }
}
