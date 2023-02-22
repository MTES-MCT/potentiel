import { InferAttributes, InferCreationAttributes, Model, DataTypes } from 'sequelize';
import { sequelizeInstance } from '../../../../sequelize.config';

class GestionnairesRéseauListe extends Model<
  InferAttributes<GestionnairesRéseauListe>,
  InferCreationAttributes<GestionnairesRéseauListe>
> {
  id: string;
  nom: string;
}

const nomProjection = 'gestionnairesRéseauListe';

GestionnairesRéseauListe.init(
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
  },
  {
    sequelize: sequelizeInstance,
    tableName: nomProjection,
    timestamps: false,
    freezeTableName: true,
  },
);

export { GestionnairesRéseauListe };
