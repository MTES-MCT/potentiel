import { InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import { GestionnaireRéseauDétail } from '../gestionnairesRéseau/détail/gestionnairesRéseauDétail.model';
import { makeSequelizeProjector } from '../makeSequelizeProjector';

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

export const RaccordementsProjector = makeSequelizeProjector(Raccordements);
