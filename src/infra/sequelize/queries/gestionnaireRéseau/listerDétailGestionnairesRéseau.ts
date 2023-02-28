import { GestionnaireRéseauDétail } from '@infra/sequelize/projectionsNext/gestionnairesRéseau/détail/gestionnairesRéseauDétail.model';
import { ListerDétailGestionnairesRéseauQueryHandler } from '@modules/gestionnaireRéseau/lister';

export const listerDétailGestionnairesRéseauQueryHandler: ListerDétailGestionnairesRéseauQueryHandler =
  () => GestionnaireRéseauDétail.findAll({ raw: true });
