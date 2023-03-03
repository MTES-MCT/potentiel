import { User } from '../users/users.model';
import { UserProjectClaims } from './userProjectClaims.model';

export const initUserProjectClaimsModelAssociations = () => {
  UserProjectClaims.belongsTo(User, { foreignKey: 'userId' });
};
