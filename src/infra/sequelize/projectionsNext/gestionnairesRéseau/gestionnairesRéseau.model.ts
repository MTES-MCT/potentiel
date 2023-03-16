import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export class GestionnaireRéseau extends Model<
  InferAttributes<GestionnaireRéseau>,
  InferCreationAttributes<GestionnaireRéseau>
> {
  codeEIC: string;
  raisonSociale: string;
  format?: string;
  légende?: string;
}
