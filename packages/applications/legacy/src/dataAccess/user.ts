import { User, Project } from '../entities';
import { Région } from '../modules/dreal/région';
import { ResultAsync, OptionAsync } from '../types';

export type UserRepo = {
  findById: (id: User['id']) => OptionAsync<User>;
  findAll: (query?: Record<string, any>) => Promise<Array<User>>;
  insert: (user: User) => ResultAsync<User>;
  update: (user: User) => ResultAsync<User>;

  remove: (userId: User['id']) => ResultAsync<null>;
  findDrealsForUser: (userId: User['id']) => Promise<Array<Région>>;
};
