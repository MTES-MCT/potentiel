import { makeCreateUser } from '../modules/users';
import { userRepo } from './repos.config';
import makeShouldUserAccessProject from '../useCases/shouldUserAccessProject';

export const shouldUserAccessProject = makeShouldUserAccessProject();

export const createUser = makeCreateUser({
  userRepo,
});
