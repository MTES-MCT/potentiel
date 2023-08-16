import { User, Project } from '../entities';
import { Région } from '../modules/dreal/région';
import { ResultAsync, OptionAsync } from '../types';

export type UserRepo = {
  findById: (id: User['id']) => OptionAsync<User>;
  findAll: (query?: Record<string, any>) => Promise<Array<User>>;
  insert: (user: User) => ResultAsync<User>;
  update: (user: User) => ResultAsync<User>;

  hasProject: (userId: User['id'], projectId: Project['id']) => Promise<boolean>;
  remove: (userId: User['id']) => ResultAsync<null>;
  findUsersForDreal: (dreal: string) => Promise<Array<User>>;
  findDrealsForUser: (userId: User['id']) => Promise<Array<Région>>;
  addToDreal: (userId: User['id'], dreal: Région) => ResultAsync<null>;
};
