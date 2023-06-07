import { ConsulterGestionnaireRéseauQuery } from './consulter/consulterGestionnaireRéseau.query';
import { ListerGestionnaireRéseauQuery } from './lister/listerGestionnaireRéseau.query';

type GestionnaireRéseauQuery = ConsulterGestionnaireRéseauQuery | ListerGestionnaireRéseauQuery;

export { GestionnaireRéseauQuery, ListerGestionnaireRéseauQuery, ConsulterGestionnaireRéseauQuery };
