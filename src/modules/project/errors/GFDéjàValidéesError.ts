import { DomainError } from '@core/domain';

export class GFDéjàValidéesError extends DomainError {
  constructor() {
    super('Les garanties financières de ce projet sont déjà validées.');
  }
}
