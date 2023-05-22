// Queries
export { buildConsulterProjetQuery } from './consulter/consulterProjet.query';

// ReadModel
export { ProjetReadModel, RésuméProjetReadModel } from './projet.readModel';

// Commands
export { buildModifierGestionnaireRéseauProjetCommand } from './modifierGestionnaireRéseau/modifierGestionnaireRéseauProjet.command';

// EventHandlers (TODO: sera supprimé lorsque le mediateur pourra publish des messages)
export { gestionnaireRéseauProjetModifiéHandlerFactory } from './modifierGestionnaireRéseau/handlers/gestionnaireRéseauProjetModifié.handler';
