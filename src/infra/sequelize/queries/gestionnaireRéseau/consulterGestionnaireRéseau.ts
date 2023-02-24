import { GestionnaireRéseauDétail } from '@infra/sequelize/projectionsNext/gestionnairesRéseau/gestionnairesRéseauDétail.model';
import { ConsulterGestionnaireRéseauQueryHandler } from '@modules/gestionnaireRéseau';

export const consulterGestionnaireRéseauQueryHandler: ConsulterGestionnaireRéseauQueryHandler = ({
  id,
}) => GestionnaireRéseauDétail.findByPk(id, { raw: true });
