import { GestionnaireRéseauDétail } from '@infra/sequelize/projectionsNext/gestionnairesRéseau/gestionnairesRéseauDétail.model';
import { ConsulterGestionnaireRéseauQueryHandler } from '@modules/gestionnaireRéseau';

export const consulterGestionnaireRéseauQueryHandler: ConsulterGestionnaireRéseauQueryHandler = ({
  codeEIC,
}) => GestionnaireRéseauDétail.findByPk(codeEIC, { raw: true });
