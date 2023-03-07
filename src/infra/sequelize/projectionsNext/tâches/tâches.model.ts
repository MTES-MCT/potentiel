import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { makeSequelizeProjector } from '../makeSequelizeProjector';

export const typesTâche = ['maj-données-de-raccordement'] as const;
export type TâchesType = typeof typesTâche[number];

export const étatsTâche = ['en cours', 'terminée'] as const;

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

export class Tâches extends Model<InferAttributes<Tâches>, InferCreationAttributes<Tâches>> {
  id: CreationOptional<number>;
  gestionnaire: string;
  type: TâchesType;
  état: typeof étatsTâche[number];
  dateDeDébut: Date;
  dateDeFin?: Date;
  résultat?: Résultat;
}

export const TâchesProjector = makeSequelizeProjector(Tâches);
