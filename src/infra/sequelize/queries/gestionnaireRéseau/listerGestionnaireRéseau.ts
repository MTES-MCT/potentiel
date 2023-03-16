import { GestionnaireRéseau } from '@infra/sequelize/projectionsNext';
import { ListerGestionnairesRéseau } from '@modules/gestionnaireRéseau';

export const listerGestionnairesRéseau: ListerGestionnairesRéseau = () =>
  GestionnaireRéseau.findAll({ raw: true, order: [['raisonSociale', 'ASC']] });
