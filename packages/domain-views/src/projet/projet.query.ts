import { CandidatureQuery } from './candidature/candidature.query';
import { GestionnaireRéseauLauréatQuery } from './lauréat/gestionnaireRéseau/gestionnaireRéseauLauréat.query';

// Queries
export type ProjetQuery = GestionnaireRéseauLauréatQuery | CandidatureQuery;

export * from './lauréat/gestionnaireRéseau/gestionnaireRéseauLauréat.query';
export * from './candidature/candidature.query';
