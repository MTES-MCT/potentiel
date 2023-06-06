import { DomainEvent } from '@potentiel/core-domain';

export type AccuséRéceptionDemandeComplèteRaccordementTransmisEvent = DomainEvent<
  'AccuséRéceptionDemandeComplèteRaccordementTransmis',
  {
    identifiantProjet: string;
    format: string;
    référenceDossierRaccordement: string;
  }
>;

export type PropositionTechniqueEtFinancièreSignéeTransmiseEvent = DomainEvent<
  'PropositionTechniqueEtFinancièreSignéeTransmise',
  {
    identifiantProjet: string;
    format: string;
    référenceDossierRaccordement: string;
  }
>;

export type DemandeComplèteRaccordementModifiéeEvent = DomainEvent<
  'DemandeComplèteRaccordementModifiée',
  {
    identifiantProjet: string;
    dateQualification: string;
    referenceActuelle: string;
    nouvelleReference: string;
  }
>;

export type PropositionTechniqueEtFinancièreModifiéeEvent = DomainEvent<
  'PropositionTechniqueEtFinancièreModifiée',
  {
    identifiantProjet: string;
    dateSignature: string;
    référenceDossierRaccordement: string;
  }
>;

export type DateMiseEnServiceTransmiseEvent = DomainEvent<
  'DateMiseEnServiceTransmise',
  {
    dateMiseEnService: string;
    référenceDossierRaccordement: string;
    identifiantProjet: string;
  }
>;

export type DemandeComplèteRaccordementTransmiseEvent = DomainEvent<
  'DemandeComplèteDeRaccordementTransmise',
  {
    identifiantProjet: string;
    identifiantGestionnaireRéseau: string;
    dateQualification?: string;
    référenceDossierRaccordement: string;
  }
>;

export type PropositionTechniqueEtFinancièreTransmiseEvent = DomainEvent<
  'PropositionTechniqueEtFinancièreTransmise',
  {
    dateSignature: string;
    référenceDossierRaccordement: string;
    identifiantProjet: string;
  }
>;

export type RaccordementEvent =
  | DemandeComplèteRaccordementTransmiseEvent
  | DemandeComplèteRaccordementModifiéeEvent
  | PropositionTechniqueEtFinancièreTransmiseEvent
  | PropositionTechniqueEtFinancièreModifiéeEvent
  | DateMiseEnServiceTransmiseEvent;
