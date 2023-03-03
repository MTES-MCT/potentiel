import { GarantiesFinancières } from '../garantiesFinancières/garantiesFinancières.model';
import { File } from '../file/file.model';
import { UserProjects } from '../userProjects/userProjects.model';
import { Raccordements } from '../raccordements/raccordements.model';
import { Project } from './project.model';

export const initProjectModelModelAssociation = () => {
  Project.belongsTo(File, {
    foreignKey: 'dcrFileId',
    as: 'dcrFileRef',
  });

  Project.belongsTo(File, {
    foreignKey: 'certificateFileId',
    as: 'certificateFile',
  });

  Project.hasMany(UserProjects, {
    as: 'users',
    foreignKey: 'projectId',
  });

  Project.hasOne(GarantiesFinancières, {
    as: 'garantiesFinancières',
    foreignKey: 'projetId',
  });

  Project.hasOne(Raccordements, {
    as: 'raccordements',
    foreignKey: 'projetId',
  });
};
