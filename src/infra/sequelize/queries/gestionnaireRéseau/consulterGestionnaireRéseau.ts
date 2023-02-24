import { GestionnaireRéseauDétail } from '@infra/sequelize/projectionsNext/gestionnairesRéseau/gestionnairesRéseauDétail.model';
import { ConsulterGestionnaireRéseau } from '@modules/gestionnaireRéseau';

export const consulterGestionnaireRéseau: ConsulterGestionnaireRéseau = (id: string) =>
  GestionnaireRéseauDétail.findByPk(id, { raw: true });
