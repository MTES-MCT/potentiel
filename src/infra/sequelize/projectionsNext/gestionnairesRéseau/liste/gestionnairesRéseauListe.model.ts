import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export class GestionnairesRéseauListe extends Model<
  InferAttributes<GestionnairesRéseauListe>,
  InferCreationAttributes<GestionnairesRéseauListe>
> {
  codeEIC: string;
  raisonSociale: string;
}
