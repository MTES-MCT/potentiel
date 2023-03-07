import { makeSequelizeProjector } from '../makeSequelizeProjector';
import { UserDreal } from './userDreal.model';

export const UserDrealProjector = makeSequelizeProjector(UserDreal);
