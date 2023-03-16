import { GestionnaireRéseau } from '@infra/sequelize/projectionsNext';
import { ConsulterGestionnaireRéseauQueryHandler } from '@modules/gestionnaireRéseau';

export const consulterGestionnaireRéseauQueryHandler: ConsulterGestionnaireRéseauQueryHandler = ({
  codeEIC,
}) => GestionnaireRéseau.findByPk(codeEIC, { raw: true });
