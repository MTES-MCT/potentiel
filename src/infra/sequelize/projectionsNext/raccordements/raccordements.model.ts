import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import { sequelizeInstance } from '../../../../sequelize.config';
import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { makeSequelizeProjector } from '../../helpers';
import { GestionnaireRéseauDétail } from '../gestionnairesRéseau';

export class Raccordements extends Model<
  InferAttributes<Raccordements>,
  InferCreationAttributes<Raccordements>
> {
  id: string;
  projetId: string;
  ptfFichierId?: string | null;
  ptfDateDeSignature: Date | null;
  ptfEnvoyéePar: string | null;
  identifiantGestionnaire: string | null;
  codeEICGestionnaireRéseau?: string | null;
  gestionnaireRéseauDétail?: NonAttribute<GestionnaireRéseauDétail>;
}

export const nomProjection = 'raccordements';

Raccordements.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    projetId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    ptfFichierId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    ptfDateDeSignature: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ptfEnvoyéePar: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    identifiantGestionnaire: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    codeEICGestionnaireRéseau: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['projetId'],
      },
    ],
    sequelize: sequelizeInstance,
    tableName: nomProjection,
    timestamps: true,
    freezeTableName: true,
  },
);

const RaccordementsProjector = makeSequelizeProjector(Raccordements, nomProjection);

export { Raccordements, RaccordementsProjector };
export const RaccordementsProjector = makeSequelizeProjector(Raccordements, nomProjection);
