import { makeSequelizeProjector } from '@infra/sequelize/helpers';
import { InferAttributes, InferCreationAttributes, Model, DataTypes } from 'sequelize';
import { sequelizeInstance } from '../../../../../sequelize.config';

class GestionnairesRéseauListe extends Model<
  InferAttributes<GestionnairesRéseauListe>,
  InferCreationAttributes<GestionnairesRéseauListe>
> {
  codeEIC: string;
  raisonSociale: string;
}

const nomProjection = 'gestionnairesRéseauListe';

GestionnairesRéseauListe.init(
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
  },
  {
    sequelize: sequelizeInstance,
    tableName: nomProjection,
    timestamps: false,
    freezeTableName: true,
  },
);

const GestionnairesRéseauListeProjector = makeSequelizeProjector(
  GestionnairesRéseauListe,
  nomProjection,
);

export { GestionnairesRéseauListe, GestionnairesRéseauListeProjector };
