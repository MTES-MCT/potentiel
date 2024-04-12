import { makeSequelizeProjector } from '../makeSequelizeProjector';
import { User } from './users.model';

export const UserProjector = makeSequelizeProjector(User);
