import {
  ConsulterFournisseurQuery,
  ConsulterFournisseurReadModel,
} from './consulter/consulterFournisseur.query';
import { ModifierÉvaluationCarboneUseCase } from './modifier/modifierÉvaluationCarbone.usecase';
import {
  ConsulterChangementFournisseurQuery,
  ConsulterChangementFournisseurReadModel,
} from './changement/consulter/consulterChangementFournisseur.query';
import {
  ListerChangementFournisseurQuery,
  ListerChangementFournisseurReadModel,
} from './changement/lister/listerChangementFournisseur.query';
import {
  ListerHistoriqueFournisseurProjetQuery,
  ListerHistoriqueFournisseurProjetReadModel,
  HistoriqueFournisseurProjetListItemReadModel,
} from './listerHistorique/listerHistoriqueFournisseurProjet.query';
import { MettreÀJourFournisseurUseCase } from './changement/miseAJour/common/mettreÀJourFournisseur.usecase';

// Query
export type FournisseurQuery =
  | ConsulterFournisseurQuery
  | ConsulterChangementFournisseurQuery
  | ListerChangementFournisseurQuery
  | ListerHistoriqueFournisseurProjetQuery;
export type {
  ConsulterFournisseurQuery,
  ConsulterChangementFournisseurQuery,
  ListerChangementFournisseurQuery,
  ListerHistoriqueFournisseurProjetQuery,
};

// ReadModel
export {
  ConsulterFournisseurReadModel,
  ListerChangementFournisseurReadModel,
  ConsulterChangementFournisseurReadModel,
  ListerHistoriqueFournisseurProjetReadModel,
  HistoriqueFournisseurProjetListItemReadModel,
};

// UseCases
export type FournisseurUseCase = ModifierÉvaluationCarboneUseCase | MettreÀJourFournisseurUseCase;
export { ModifierÉvaluationCarboneUseCase, MettreÀJourFournisseurUseCase };

// Event
export { FournisseurEvent } from './fournisseur.event';
export { FournisseurImportéEvent } from './importer/importerFournisseur.event';
export { ÉvaluationCarboneModifiéeEvent } from './modifier/modifierÉvaluationCarbone.event';
export { ChangementFournisseurEnregistréEvent } from './changement/miseAJour/enregistrerChangement.event';
export { FournisseurModifiéEvent } from './changement/miseAJour/modifierFournisseur.event';

// Register
export { registerFournisseurQueries } from './fournisseur.register';

// ValueTypes
export * as TypeFournisseur from './typeFournisseur.valueType';
export * as Fournisseur from './fournisseur.valueType';
export * as TypeDocumentFournisseur from './typeDocumentFournisseur.valueType';
export * as NoteÉvaluationCarbone from './noteÉvaluationCarbone.valueType';

// Entities
export * from './fournisseur.entity';
export * from './changement/changementFournisseur.entity';
