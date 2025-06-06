import { ChoisirCahierDesChargesUseCase } from './cahierDesCharges/choisir/choisirCahierDesCharges.usecase';
import {
  ConsulterCahierDesChargesChoisiQuery,
  ConsulterCahierDesChargesChoisiReadModel,
} from './cahierDesCharges/consulter/consulterCahierDesChargesChoisi.query';
import {
  ConsulterLauréatQuery,
  ConsulterLauréatReadModel,
} from './consulter/consulterLauréat.query';
import { ModifierLauréatUseCase } from './modifier/modifierLauréat.usecase';
import { NotifierLauréatUseCase } from './notifier/notifierLauréat.usecase';

// Query
export type LauréatQuery = ConsulterLauréatQuery | ConsulterCahierDesChargesChoisiQuery;
export { ConsulterLauréatQuery, ConsulterCahierDesChargesChoisiQuery };

// ReadModel
export { ConsulterLauréatReadModel, ConsulterCahierDesChargesChoisiReadModel };

// Port
export { ConsulterCahierDesChargesChoisiPort } from './cahierDesCharges/consulter/consulterCahierDesChargesChoisi.query';

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
export * as Achèvement from './achèvement';
export * as Délai from './délai';
export * as GarantiesFinancières from './garanties-financières';
export * as Producteur from './producteur';
export * as Puissance from './puissance';
export * as Fournisseur from './fournisseur';
