import { GestionnairesRéseauListe } from '@infra/sequelize/projectionsNext/gestionnairesRéseau/liste/gestionnairesRéseauListe.model';
import { ListerGestionnairesRéseau } from '@modules/gestionnaireRéseau/lister/ListerGestionnairesRéseau';

export const listerGestionnairesRéseau: ListerGestionnairesRéseau = () =>
  GestionnairesRéseauListe.findAll({ raw: true });
