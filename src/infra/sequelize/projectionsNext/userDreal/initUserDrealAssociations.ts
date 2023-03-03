import { User } from '../users/users.model';
import { UserDreal } from './userDreal.model';

export const initUserDrealModelAssociations = () => {
  UserDreal.belongsTo(User, { foreignKey: 'userId' });
};
