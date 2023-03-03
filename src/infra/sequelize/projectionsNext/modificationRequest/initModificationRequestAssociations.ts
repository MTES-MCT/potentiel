import { Project } from '../project/project.model';
import { File } from '../file/file.model';
import { User } from '../users/users.model';
import { ModificationRequest } from './modificationRequest.model';

export const initModificationRequestModelAssociations = () => {
  ModificationRequest.belongsTo(File, {
    foreignKey: 'fileId',
    as: 'attachmentFile',
    constraints: false,
  });

  ModificationRequest.belongsTo(File, {
    foreignKey: 'responseFileId',
    as: 'responseFile',
    constraints: false,
  });

  ModificationRequest.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project',
    constraints: false,
  });

  ModificationRequest.belongsTo(User, {
    foreignKey: 'userId',
    as: 'requestedBy',
    constraints: false,
  });
  ModificationRequest.belongsTo(User, {
    foreignKey: 'respondedBy',
    as: 'respondedByUser',
    constraints: false,
  });
  ModificationRequest.belongsTo(User, {
    foreignKey: 'confirmationRequestedBy',
    as: 'confirmationRequestedByUser',
    constraints: false,
  });
  ModificationRequest.belongsTo(User, {
    foreignKey: 'cancelledBy',
    as: 'cancelledByUser',
    constraints: false,
  });
};
