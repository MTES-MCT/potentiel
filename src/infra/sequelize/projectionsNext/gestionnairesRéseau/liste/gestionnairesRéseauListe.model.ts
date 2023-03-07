import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { makeSequelizeProjector } from '../../makeSequelizeProjector';

export class GestionnairesRéseauListe extends Model<
  InferAttributes<GestionnairesRéseauListe>,
  InferCreationAttributes<GestionnairesRéseauListe>
> {
  codeEIC: string;
  raisonSociale: string;
}

export const gestionnairesRéseauListeTableName = 'gestionnairesRéseauListe';

export const GestionnairesRéseauListeProjector = makeSequelizeProjector(
  GestionnairesRéseauListe,
  gestionnairesRéseauListeTableName,
);
