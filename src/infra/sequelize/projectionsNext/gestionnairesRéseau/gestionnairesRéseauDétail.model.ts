import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export class GestionnaireRéseauDétail extends Model<
  InferAttributes<GestionnaireRéseauDétail>,
  InferCreationAttributes<GestionnaireRéseauDétail>
> {
  codeEIC: string;
  raisonSociale: string;
  format?: string;
  légende?: string;
}
