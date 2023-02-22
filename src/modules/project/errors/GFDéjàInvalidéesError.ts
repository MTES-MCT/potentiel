import { DomainError } from '@core/domain';

export class GFDéjàInvalidéesError extends DomainError {
  constructor() {
    super('Les garanties financières de ce projet sont déjà invalidées.');
  }
}
