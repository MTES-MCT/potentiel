import { makeSequelizeProjector } from '../makeSequelizeProjector';
import { UserProjects } from './userProjects.model';

export const UserProjectsProjector = makeSequelizeProjector(UserProjects);
