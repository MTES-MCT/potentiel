import { makeSequelizeProjector } from '@infra/sequelize/helpers';
import { InferAttributes, InferCreationAttributes, Model, DataTypes } from 'sequelize';
import { sequelizeInstance } from '../../../../../sequelize.config';

class GestionnaireRéseauDétail extends Model<
  InferAttributes<GestionnaireRéseauDétail>,
  InferCreationAttributes<GestionnaireRéseauDétail>
> {
  codeEIC: string;
  raisonSociale: string;
  format?: string;
  légende?: string;
}

const nomProjection = 'gestionnaireRéseauDétail';

GestionnaireRéseauDétail.init(
  {
    codeEIC: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    raisonSociale: {
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

const GestionnaireRéseauDétailProjector = makeSequelizeProjector(
  GestionnaireRéseauDétail,
  nomProjection,
);

export { GestionnaireRéseauDétail, GestionnaireRéseauDétailProjector };
