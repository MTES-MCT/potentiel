import { DomainEvent } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '../projet/projet.valueType';
import { RawRéférenceDossierRaccordement } from './raccordement.valueType';
import { RawIdentifiantGestionnaireRéseau } from '../domain.valueType';

export type AccuséRéceptionDemandeComplèteRaccordementTransmisEvent = DomainEvent<
  'AccuséRéceptionDemandeComplèteRaccordementTransmis',
  {
    identifiantProjet: RawIdentifiantProjet;
    format: string;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement;
  }
>;

export type PropositionTechniqueEtFinancièreSignéeTransmiseEvent = DomainEvent<
  'PropositionTechniqueEtFinancièreSignéeTransmise',
  {
    identifiantProjet: RawIdentifiantProjet;
    format: string;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement;
  }
>;

/**
 * @deprecated Utilisez DemandeComplèteRaccordementModifiéeEventV1 et RéférenceDossierRacordementModifiéeEventV1 à la place. Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type DemandeComplèteRaccordementModifiéeEventV0 = DomainEvent<
  'DemandeComplèteRaccordementModifiée',
  {
    identifiantProjet: RawIdentifiantProjet;
    dateQualification: string;
    referenceActuelle: RawRéférenceDossierRaccordement;
    nouvelleReference: RawRéférenceDossierRaccordement;
  }
>;

//v1
export type DemandeComplèteRaccordementModifiéeEventV1 = DomainEvent<
  'DemandeComplèteRaccordementModifiée-V1',
  {
    identifiantProjet: RawIdentifiantProjet;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement;
    dateQualification: string;
  }
>;

export type RéférenceDossierRacordementModifiéeEventV1 = DomainEvent<
  'RéférenceDossierRacordementModifiée-V1',
  {
    identifiantProjet: RawIdentifiantProjet;
    référenceDossierRaccordementActuelle: RawRéférenceDossierRaccordement;
    nouvelleRéférenceDossierRaccordement: RawRéférenceDossierRaccordement;
  }
>;

export type PropositionTechniqueEtFinancièreModifiéeEvent = DomainEvent<
  'PropositionTechniqueEtFinancièreModifiée',
  {
    identifiantProjet: RawIdentifiantProjet;
    dateSignature: string;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement;
  }
>;

export type DateMiseEnServiceTransmiseEvent = DomainEvent<
  'DateMiseEnServiceTransmise',
  {
    dateMiseEnService: string;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement;
    identifiantProjet: RawIdentifiantProjet;
  }
>;

export type DemandeComplèteRaccordementTransmiseEvent = DomainEvent<
  'DemandeComplèteDeRaccordementTransmise',
  {
    identifiantProjet: RawIdentifiantProjet;
    identifiantGestionnaireRéseau: RawIdentifiantGestionnaireRéseau;
    dateQualification?: string;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement;
  }
>;

export type PropositionTechniqueEtFinancièreTransmiseEvent = DomainEvent<
  'PropositionTechniqueEtFinancièreTransmise',
  {
    dateSignature: string;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement;
    identifiantProjet: RawIdentifiantProjet;
  }
>;

export type RaccordementEvent =
  | AccuséRéceptionDemandeComplèteRaccordementTransmisEvent
  | DemandeComplèteRaccordementTransmiseEvent
  | DemandeComplèteRaccordementModifiéeEventV0
  | DemandeComplèteRaccordementModifiéeEventV1
  | RéférenceDossierRacordementModifiéeEventV1
  | PropositionTechniqueEtFinancièreTransmiseEvent
  | PropositionTechniqueEtFinancièreSignéeTransmiseEvent
  | PropositionTechniqueEtFinancièreModifiéeEvent
  | DateMiseEnServiceTransmiseEvent;
