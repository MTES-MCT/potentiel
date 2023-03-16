import { InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import { GestionnaireRéseau } from '../gestionnairesRéseau/gestionnairesRéseau.model';

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
  gestionnaireRéseau?: NonAttribute<GestionnaireRéseau>;
}
