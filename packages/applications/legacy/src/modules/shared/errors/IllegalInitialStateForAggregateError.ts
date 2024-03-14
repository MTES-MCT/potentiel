import { DomainError, UniqueEntityID } from '../../../core/domain';

type IllegalInitialStateForAggregateErrorDetails = {
  projectId: UniqueEntityID;
  errorMessage: string;
};

export class IllegalInitialStateForAggregateError extends DomainError {
  constructor(public details?: IllegalInitialStateForAggregateErrorDetails) {
    super("L'objet concerné semble endommagé.");
  }
}
