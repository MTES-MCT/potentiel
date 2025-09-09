import { ChoisirCahierDesChargesUseCase } from './cahierDesCharges/choisir/choisirCahierDesCharges.usecase';
import {
  ConsulterCahierDesChargesQuery,
  ConsulterCahierDesChargesReadModel,
} from './cahierDesCharges/consulter/consulterCahierDesCharges.query';
import {
  ConsulterLauréatQuery,
  ConsulterLauréatReadModel,
} from './consulter/consulterLauréat.query';
import {
  ListerHistoriqueProjetQuery,
  ListerHistoriqueProjetReadModel,
  HistoriqueListItemReadModels,
  HistoriqueLauréatProjetListItemReadModel,
  HistoriqueAchèvementProjetListItemReadModel,
  HistoriqueGarantiesFinancièresProjetListItemReadModel,
} from './historique/lister/listerHistoriqueProjet.query';
import { ModifierLauréatUseCase } from './modifier/modifierLauréat.usecase';
import { NotifierLauréatUseCase } from './notifier/notifierLauréat.usecase';

// Query
export type LauréatQuery =
  | ConsulterLauréatQuery
  | ConsulterCahierDesChargesQuery
  | ListerHistoriqueProjetQuery;
export { ConsulterLauréatQuery, ConsulterCahierDesChargesQuery, ListerHistoriqueProjetQuery };

// ReadModel
export {
  ConsulterLauréatReadModel,
  ConsulterCahierDesChargesReadModel,
  ListerHistoriqueProjetReadModel,
  HistoriqueListItemReadModels,
  HistoriqueLauréatProjetListItemReadModel,
  HistoriqueGarantiesFinancièresProjetListItemReadModel,
  HistoriqueAchèvementProjetListItemReadModel,
};

// Port
export { ConsulterCahierDesChargesPort } from './cahierDesCharges/consulter/consulterCahierDesCharges.query';

// UseCases
export type LauréatUseCase =
  | NotifierLauréatUseCase
  | ModifierLauréatUseCase
  | ChoisirCahierDesChargesUseCase;
export { NotifierLauréatUseCase, ModifierLauréatUseCase, ChoisirCahierDesChargesUseCase };

// Events
export { LauréatEvent } from './lauréat.event';
export {
  LauréatNotifiéEvent,
  LauréatNotifiéV1Event,
  NomEtLocalitéLauréatImportésEvent,
} from './notifier/lauréatNotifié.event';
export { LauréatModifiéEvent } from './modifier/lauréatModifié.event';
export { CahierDesChargesChoisiEvent } from './cahierDesCharges/choisir/cahierDesChargesChoisi.event';

// Register
export { registerLauréatQueries, registerLauréatUseCases } from './lauréat.register';

// Entities
export { LauréatEntity } from './lauréat.entity';

// ValueType
export * as Abandon from './abandon';
export * as Actionnaire from './actionnaire';
export * as Achèvement from './achèvement';
export * as Délai from './délai';
export * as GarantiesFinancières from './garanties-financières';
export * as Producteur from './producteur';
export * as Puissance from './puissance';
export * as Fournisseur from './fournisseur';
export * as ReprésentantLégal from './représentantLégal';
export * as Raccordement from './raccordement';
export * as TâchePlanifiée from './tâche-planifiée';
export * as Tâche from './tâche';
export * as Installateur from './installateur';
