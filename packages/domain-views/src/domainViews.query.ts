import { Create, Find, List, Remove, Search, Update, Upsert } from '@potentiel-domain/core-views';
import { registerConsulterAbandonQuery } from './projet/lauréat/abandon/consulter/consulterAbandon.query';
import { registerConsulterPièceJustificativeAbandonProjetQuery } from './projet/lauréat/abandon/consulter/consulterPièceJustificativeAbandon.query';
import { registerListerAbandonAvecRecandidatureQuery } from './projet/lauréat/abandon/lister/listerAbandon.query';
import { registerConsulterGestionnaireRéseauLauréatQuery } from './projet/lauréat/gestionnaireRéseau/consulter/consulterGestionnaireRéseauLauréat.query';
import { registerConsulterRéponseAbandonSignéeQuery } from './projet/lauréat/abandon/consulter/consulterRéponseSignéeAbandon.query';
import { ProjetDependencies } from './projet/projet.setup';

export * from './appelOffre/appelOffre.query';
export * from './gestionnaireRéseau/gestionnaireRéseau.query';
export * from './projet/projet.query';
export * from './raccordement/raccordement.query';
export * from './utilisateur/utilisateur.query';

type CommonDependencies = {
  find: Find;
  list: List;
  search: Search;
  create: Create;
  remove: Remove;
  update: Update;
  upsert: Upsert;
};

type Dependencies = {
  common: CommonDependencies;
  projet: Omit<ProjetDependencies, keyof CommonDependencies | 'subscribe'>;
};

export const registerQueries = ({ common, projet }: Dependencies) => {
  registerConsulterAbandonQuery({
    ...common,
  });
  registerConsulterGestionnaireRéseauLauréatQuery({
    ...common,
  });
  registerListerAbandonAvecRecandidatureQuery({
    ...common,
  });
  registerConsulterPièceJustificativeAbandonProjetQuery({
    ...common,
    ...projet,
  });
  registerConsulterRéponseAbandonSignéeQuery({
    ...common,
    ...projet,
  });
};
