// Queries
export { buildConsulterProjetQuery } from './consulter/consulterProjet.query';

// ReadModel
export { ProjetReadModel, RésuméProjetReadModel } from './projet.readModel';

// Usecases
export { buildModifierGestionnaireRéseauProjetUseCase } from './modifierGestionnaireRéseauProjet.usecase';

// EventHandlers (TODO: sera supprimé lorsque le mediateur pourra publish des messages)
export { gestionnaireRéseauProjetModifiéHandlerFactory } from './modifierGestionnaireRéseau/handlers/gestionnaireRéseauProjetModifié.handler';
