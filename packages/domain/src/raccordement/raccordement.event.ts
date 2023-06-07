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

/**
 * @deprecated Utilisez DemandeComplèteRaccordementModifiéeEventV1 et RéférenceDossierRacordementModifiéeEventV1 à la place. Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type DemandeComplèteRaccordementModifiéeEventV0 = DomainEvent<
  'DemandeComplèteRaccordementModifiée',
  {
    identifiantProjet: string;
    dateQualification: string;
    referenceActuelle: string;
    nouvelleReference: string;
  }
>;

//v1
export type DemandeComplèteRaccordementModifiéeEventV1 = DomainEvent<
  'DemandeComplèteRaccordementModifiée-V1',
  {
    identifiantProjet: string;
    référenceDossierRaccordement: string;
    dateQualification: string;
  }
>;

export type RéférenceDossierRacordementModifiéeEventV1 = DomainEvent<
  'RéférenceDossierRacordementModifiée-V1',
  {
    identifiantProjet: string;
    référenceDossierRaccordementActuelle: string;
    nouvelleRéférenceDossierRaccordement: string;
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
  | AccuséRéceptionDemandeComplèteRaccordementTransmisEvent
  | DemandeComplèteRaccordementTransmiseEvent
  | DemandeComplèteRaccordementModifiéeEventV0
  | DemandeComplèteRaccordementModifiéeEventV1
  | RéférenceDossierRacordementModifiéeEventV1
  | PropositionTechniqueEtFinancièreTransmiseEvent
  | PropositionTechniqueEtFinancièreSignéeTransmiseEvent
  | PropositionTechniqueEtFinancièreModifiéeEvent
  | DateMiseEnServiceTransmiseEvent;
