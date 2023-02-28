import { makeSequelizeProjector } from '@infra/sequelize/helpers';
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  NOW,
} from 'sequelize';
import { sequelizeInstance } from '../../../../sequelize.config';
import { Project } from '../../projections/project';
import { User } from '../users';
import { File } from '../../projections/file';

class ModificationRequest extends Model<
  InferAttributes<ModificationRequest>,
  InferCreationAttributes<ModificationRequest>
> {
  id: string;
  projectId: string;
  userId?: string;
  type:
    | 'actionnaire'
    | 'fournisseur'
    | 'producteur'
    | 'puissance'
    | 'recours'
    | 'abandon'
    | 'delai'
    | 'annulation abandon'
    | 'autre';
  status: string;
  requestedOn: number;
  versionDate: CreationOptional<Date>;
  respondedOn?: number | null;
  respondedBy?: string | null;
  responseFileId?: string | null;
  acceptanceParams?: { [key: string]: string | number } | null;
  authority?: 'dreal' | 'dgec';
  filename?: string;
  fileId?: string;
  justification?: string;
  actionnaire?: string;
  producteur?: string;
  fournisseurs?: JSON;
  puissance?: number;
  puissanceAuMomentDuDepot?: number;
  evaluationCarbone?: number;
  delayInMonths?: number;
  dateAchèvementDemandée?: Date;
  confirmationRequestedBy?: string;
  confirmationRequestedOn?: number;
  confirmedBy?: string;
  confirmedOn?: number;
  cancelledBy?: string;
  cancelledOn?: number;
  isLegacy: CreationOptional<boolean | null>;
  cahierDesCharges?: string;

  project: NonAttribute<Project>;
  requestedBy: NonAttribute<{ email: string; fullName: string }>;
  attachmentFile: NonAttribute<{ id: string; filename: string }>;
}

const nomProjection = 'modificationRequests';

ModificationRequest.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requestedOn: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    respondedOn: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    respondedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    responseFileId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    acceptanceParams: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    versionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: NOW,
    },
    authority: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    justification: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actionnaire: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    producteur: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fournisseurs: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    puissance: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    puissanceAuMomentDuDepot: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    evaluationCarbone: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    delayInMonths: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dateAchèvementDemandée: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    confirmationRequestedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    confirmationRequestedOn: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    confirmedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    confirmedOn: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    cancelledBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    cancelledOn: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    isLegacy: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    cahierDesCharges: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: nomProjection,
    timestamps: true,
  },
);

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

const ModificationRequestProjector = makeSequelizeProjector(ModificationRequest, nomProjection);

export { ModificationRequest, ModificationRequestProjector };
