import { sequelizeInstance } from '../../../sequelize.config';
import { initializeProjections } from './projections.initializer';

// TODO : Il faut absolument arrêté de faire des export default et des imports avec des side effects, ASAP !
// Une partie est déjà faite, mais ce module doit éxecuter des side effects au vu de l'organisation du projet.
// On reverra ça plus tard quand le projet sera stable sur la partie projection
initializeProjections(sequelizeInstance);

// MERCI DE NE PAS UTILISER L'EXTENSION BARREL DANS CETTE PARTIE DU PROJET !!!

// Export des models
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

// Export des updates (side effects à l'intérieur..., à faire aprés l'init des models)
export * from './garantiesFinancières/updates';
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

// Export module types
export * from './projector';

// TODO : Ces guards ne devrait pas être dans une couche d'accés aux données...
export * from './projectEvents/guards';
