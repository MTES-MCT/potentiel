import { InferAttributes, InferCreationAttributes, Model, DataTypes } from 'sequelize';
import { sequelizeInstance } from '../../../../sequelize.config';

class GestionnaireRéseauDétail extends Model<
  InferAttributes<GestionnaireRéseauDétail>,
  InferCreationAttributes<GestionnaireRéseauDétail>
> {
  id: string;
  nom: string;
  format?: string;
  légende?: string;
}

const nomProjection = 'gestionnaireRéseauDétail';

GestionnaireRéseauDétail.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    format: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    légende: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeInstance,
    tableName: nomProjection,
    timestamps: false,
    freezeTableName: true,
  },
);

export { GestionnaireRéseauDétail };
