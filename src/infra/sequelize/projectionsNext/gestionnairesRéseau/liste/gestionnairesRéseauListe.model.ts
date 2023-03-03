import { makeSequelizeProjector } from '@infra/sequelize/helpers';
import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

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
