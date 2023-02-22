import { GestionnairesRéseauListe } from '@infra/sequelize/projectionsNext/gestionnairesRéseau/gestionnairesRéseauListe.model';
import { ListerGestionnairesRéseau } from '@modules/gestionnaireRéseau/lister/ListerGestionnairesRéseau';

export const listerGestionnaireRéseau: ListerGestionnairesRéseau = () =>
  GestionnairesRéseauListe.findAll({ raw: true });
