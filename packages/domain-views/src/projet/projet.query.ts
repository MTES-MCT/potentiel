import { AbandonQuery } from './lauréat/abandon/abandon.query';
import { CandidatureQuery } from './candidature/candidature.query';
import { GestionnaireRéseauLauréatQuery } from './lauréat/gestionnaireRéseau/gestionnaireRéseauLauréat.query';

// Queries
export type ProjetQuery = AbandonQuery | GestionnaireRéseauLauréatQuery | CandidatureQuery;

export * from './lauréat/abandon/abandon.query';
export * from './lauréat/gestionnaireRéseau/gestionnaireRéseauLauréat.query';
export * from './candidature/candidature.query';
