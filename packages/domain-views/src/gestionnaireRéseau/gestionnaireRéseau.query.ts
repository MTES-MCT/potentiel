import { ConsulterGestionnaireRéseauQuery } from './consulter/consulterGestionnaireRéseau.query';
import { ListerGestionnaireRéseauQuery } from './lister/listerGestionnaireRéseau.query';

export type GestionnaireRéseauQuery =
  | ConsulterGestionnaireRéseauQuery
  | ListerGestionnaireRéseauQuery;
