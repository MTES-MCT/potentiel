import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { makeSequelizeProjector } from '../../makeSequelizeProjector';

export class GestionnaireRéseauDétail extends Model<
  InferAttributes<GestionnaireRéseauDétail>,
  InferCreationAttributes<GestionnaireRéseauDétail>
> {
  codeEIC: string;
  raisonSociale: string;
  format?: string;
  légende?: string;
}

export const GestionnaireRéseauDétailProjector = makeSequelizeProjector(GestionnaireRéseauDétail);
