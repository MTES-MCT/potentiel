import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelizeInstance } from '../../../../sequelize.config';
import { makeSequelizeProjector } from '../../helpers';

const typesTâche = ['maj-données-de-raccordement'] as const;
export type TâchesType = typeof typesTâche[number];

const étatsPossibles = ['en cours', 'terminée'] as const;

type Succès = {
  projetId: string;
  identifiantGestionnaireRéseau: string;
};

type Erreur = {
  raison: string;
  projetId?: string;
  identifiantGestionnaireRéseau: string;
};

type Ignorés = {
  raison: string;
  projetId: string;
  identifiantGestionnaireRéseau: string;
};

type Résultat = {
  succès?: Array<Succès>;
  ignorés?: Array<Ignorés>;
  erreurs?: Array<Erreur>;
};

class Tâches extends Model<InferAttributes<Tâches>, InferCreationAttributes<Tâches>> {
  id: CreationOptional<number>;
  gestionnaire: string;
  type: TâchesType;
  état: typeof étatsPossibles[number];
  dateDeDébut: Date;
  dateDeFin?: Date;
  résultat?: Résultat;
}

const nomProjection = 'taches';

Tâches.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    gestionnaire: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    état: {
      type: DataTypes.ENUM(...étatsPossibles),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...typesTâche),
      allowNull: false,
    },
    dateDeDébut: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateDeFin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    résultat: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['gestionnaire', 'type', 'dateDeDébut'],
      },
    ],
    sequelize: sequelizeInstance,
    tableName: nomProjection,
    timestamps: false,
    freezeTableName: true,
  },
);

const TâchesProjector = makeSequelizeProjector(Tâches, nomProjection);

export { Tâches, TâchesProjector };
