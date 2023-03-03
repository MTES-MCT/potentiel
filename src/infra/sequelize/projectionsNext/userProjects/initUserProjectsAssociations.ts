import { User } from '../users/users.model';
import { UserProjects } from './userProjects.model';

export const initUserProjectsModelAssociations = () => {
  UserProjects.belongsTo(User, { as: 'user', foreignKey: 'userId' });
};
