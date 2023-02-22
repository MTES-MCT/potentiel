import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

export class File extends Model<InferAttributes<File>, InferCreationAttributes<File>> {
  id: string;
  filename: string;
  forProject?: string;
  createdBy?: string;
  designation: string;
  storedAt?: string;
  createdAt: CreationOptional<Date>;
}

export const MakeFileModel = (sequelize) => {
  File.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      forProject: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      storedAt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
    },
    {
      timestamps: true,
      tableName: 'files',
      sequelize,
    },
  );
  return File;
};
