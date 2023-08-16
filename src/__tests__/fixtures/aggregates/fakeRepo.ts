import { Repository, UniqueEntityID } from '../../../core/domain';
import { okAsync } from '../../../core/utils';
import { jest } from '@jest/globals';
import { EntityNotFoundError, InfraNotAvailableError } from '../../../modules/shared';

const fakeLoad = <T>(aggregate: T) =>
  jest.fn((id: UniqueEntityID) =>
    okAsync<T, EntityNotFoundError | InfraNotAvailableError>(aggregate),
  );

export const fakeRepo = <T>(aggregate?: T) => ({
  save: jest.fn<Repository<T>['save']>((aggregate: T) =>
    okAsync<null, InfraNotAvailableError>(null),
  ),
  load: aggregate ? fakeLoad(aggregate) : jest.fn<Repository<T>['load']>(),
});
