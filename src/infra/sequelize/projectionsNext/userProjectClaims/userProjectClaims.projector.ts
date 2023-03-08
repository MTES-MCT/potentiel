import { makeSequelizeProjector } from '../makeSequelizeProjector';
import { UserProjectClaims } from './userProjectClaims.model';

export const UserProjectClaimsProjector = makeSequelizeProjector(UserProjectClaims);
