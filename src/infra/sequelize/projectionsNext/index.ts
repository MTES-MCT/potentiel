// MERCI DE NE PAS UTILISER L'EXTENSION BARREL DANS CETTE PARTIE DU PROJET !!!
// TODO: executions des initializers. Malheureusement on est encore obligé de faire cela dans l'index du module, car l'init de l'app se fait avec des sides effetcs...
// Il faudrait faire ça au bootstrap de l'app (ou des tests), ne pas importer la config Sequelize et appeler les fonctions d'initialize dans ce fichier
import { sequelizeInstance } from '../../../sequelize.config';
import { initializeProjections } from './projections.initializer';

initializeProjections(sequelizeInstance);

// Export module types
export * from './projector';

// Export initializer de projectors, pour configurer le module depuis l'extérieur si besoin
export * from './projectors.initializer';
export * from './projections.initializer';

// Export des models pour utilisation dans les queries
export * from './file/file.model';
export * from './garantiesFinancières/garantiesFinancières.model';
export * from './garantiesFinancières/garantiesFinancières.projector';
export * from './gestionnairesRéseau/détail/gestionnairesRéseauDétail.model';
export * from './gestionnairesRéseau/liste/gestionnairesRéseauListe.model';
export * from './modificationRequest/modificationRequest.model';
export * from './notification/notification.model';
export * from './project/project.model';
export * from './projectEvents/projectEvent.model';
export * from './raccordements/raccordements.model';
export * from './tâches/tâches.model';
export * from './userDreal/userDreal.model';
export * from './userProjectClaims/userProjectClaims.model';
export * from './userProjects/userProjects.model';
export * from './users/users.model';

// Export des projectors pour rebuild dans les migrations si besoin
export * from './projector.factory';
export * from './garantiesFinancières/garantiesFinancières.projector';
export * from './gestionnairesRéseau/détail/gestionnaireRéseauDétail.projector';
export * from './gestionnairesRéseau/liste/gestionnairesRéseauListe.projector';
export * from './modificationRequest/modificationRequest.projector';
export * from './project/project.projector';
export * from './projectEvents/projectEvent.projector';
export * from './raccordements/raccordements.projector';
export * from './tâches/tâches.projector';
export * from './userDreal/userDreal.projector';
export * from './userProjectClaims/userProjectClaims.projector';
export * from './userProjects/userProjects.projector';
export * from './users/user.projector';

// Export des updates (side effects à l'intérieur..., à faire aprés l'init des models)
// TODO: la liste des exports qui suit doit à terme être supprimé.
export * from './gestionnairesRéseau/détail/updates';
export * from './gestionnairesRéseau/liste/updates';
export * from './modificationRequest/updates';
export * from './project/updates';
export * from './projectEvents/updates';
export * from './raccordements/updates';
export * from './tâches/updates';
export * from './userDreal/updates';
export * from './userProjectClaims/updates';
export * from './userProjects/updates';
export * from './users/updates';

// TODO : Ces guards ne devrait pas être dans une couche d'accés aux données...
export * from './projectEvents/guards';
