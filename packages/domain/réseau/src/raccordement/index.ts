import {
  ConsulterDossierRaccordementQuery,
  ConsulterDossierRaccordementReadModel,
} from './consulter/consulterDossierRaccordement.query';
import { ModifierDemandeComplèteRaccordementUseCase } from './modifier/modifierDemandeComplèteRaccordement.usecase';
import { ModifierGestionnaireRéseauRaccordementUseCase } from './modifier/modifierGestionnaireRéseauRaccordement.usecase';
import { ModifierPropositiontechniqueEtFinancièreUseCase } from './modifier/modifierPropositiontechniqueEtFinancière.usecase';
import { ModifierRéférenceDossierRaccordementUseCase } from './modifier/modifierRéférenceDossierRaccordement.usecase';
import { TransmettreDateMiseEnServiceUseCase } from './transmettre/transmettreDateMiseEnService.usecase';
import { TransmettreDemandeComplèteRaccordementUseCase } from './transmettre/transmettreDemandeComplèteRaccordement.usecase';
import { TransmettrePropositionTechniqueEtFinancièreUseCase } from './transmettre/transmettrePropositionTechniqueEtFinancière.usecase';

// Query
export type RaccordementQuery = ConsulterDossierRaccordementQuery;

export { ConsulterDossierRaccordementQuery };

// ReadModel
export { ConsulterDossierRaccordementReadModel };

// UseCases
export type GestionnaireRéseauUseCase =
  | ModifierDemandeComplèteRaccordementUseCase
  | ModifierGestionnaireRéseauRaccordementUseCase
  | ModifierPropositiontechniqueEtFinancièreUseCase
  | ModifierRéférenceDossierRaccordementUseCase
  | TransmettreDateMiseEnServiceUseCase
  | TransmettreDemandeComplèteRaccordementUseCase
  | TransmettrePropositionTechniqueEtFinancièreUseCase;

export {
  ModifierDemandeComplèteRaccordementUseCase,
  ModifierGestionnaireRéseauRaccordementUseCase,
  ModifierPropositiontechniqueEtFinancièreUseCase,
  ModifierRéférenceDossierRaccordementUseCase,
  TransmettreDateMiseEnServiceUseCase,
  TransmettreDemandeComplèteRaccordementUseCase,
  TransmettrePropositionTechniqueEtFinancièreUseCase,
};

// Event
export { RaccordementEvent } from './raccordement.aggregate';
export {
  DemandeComplèteRaccordementModifiéeEvent,
  DemandeComplèteRaccordementModifiéeEventV1,
  DemandeComplèteRaccordementModifiéeEventV2,
} from './modifier/modifierDemandeComplèteRaccordement.behavior';
export { RéférenceDossierRacordementModifiéeEvent } from './modifier/modifierRéférenceDossierRaccordement.behavior';
export {
  GestionnaireRéseauRaccordementModifiéEvent,
  GestionnaireRéseauProjetModifiéEvent,
} from './modifier/modifierGestionnaireRéseauRaccordement.behavior';
export {
  PropositionTechniqueEtFinancièreModifiéeEvent,
  PropositionTechniqueEtFinancièreModifiéeEventV1,
} from './modifier/modifierPropositiontechniqueEtFinancière.behavior';
export { DateMiseEnServiceTransmiseEvent } from './transmettre/transmettreDateMiseEnService.behavior';
export {
  DemandeComplèteRaccordementTransmiseEvent,
  AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1,
  DemandeComplèteRaccordementTransmiseEventV1,
} from './transmettre/transmettreDemandeComplèteRaccordement.behavior';
export {
  PropositionTechniqueEtFinancièreTransmiseEvent,
  PropositionTechniqueEtFinancièreSignéeTransmiseEventV1,
  PropositionTechniqueEtFinancièreTransmiseEventV1,
} from './transmettre/transmettrePropositionTechniqueEtFinancière.behavior';

// ValueTypes
export * as RéférenceDossierRaccordement from './référenceDossierRaccordement.valueType';
export * as TypeDocumentRaccordement from './typeDocumentRaccordement.valueType';

// Entities
export * from './raccordement.entity';
