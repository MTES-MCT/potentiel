import { Project } from '../project/project.model';
import { User } from './users.model';

export const initUserModelAssociations = () => {
  User.hasMany(Project, { as: 'candidateProjects', foreignKey: 'email', sourceKey: 'email' });
};
