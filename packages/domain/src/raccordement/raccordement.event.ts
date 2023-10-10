import { DomainEvent } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '../projet/projet.valueType';
import { RawRéférenceDossierRaccordement } from './raccordement.valueType';
import { RawIdentifiantGestionnaireRéseau } from '../domain.valueType';

export type AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1 = DomainEvent<
  'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1',
  {
    identifiantProjet: RawIdentifiantProjet;
    format: string;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement;
  }
>;

export type PropositionTechniqueEtFinancièreSignéeTransmiseEventV1 = DomainEvent<
  'PropositionTechniqueEtFinancièreSignéeTransmise-V1',
  {
    identifiantProjet: RawIdentifiantProjet;
    format: string;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement;
  }
>;

/**
 * @deprecated Utilisez DemandeComplèteRaccordementModifiéeEventV1 et RéférenceDossierRacordementModifiéeEventV1 à la place. Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type DemandeComplèteRaccordementModifiéeEventV1 = DomainEvent<
  'DemandeComplèteRaccordementModifiée-V1',
  {
    identifiantProjet: RawIdentifiantProjet;
    dateQualification: string;
    referenceActuelle: RawRéférenceDossierRaccordement;
    nouvelleReference: RawRéférenceDossierRaccordement;
  }
>;

export type DemandeComplèteRaccordementModifiéeEventV2 = DomainEvent<
  'DemandeComplèteRaccordementModifiée-V2',
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

export type PropositionTechniqueEtFinancièreModifiéeEventV1 = DomainEvent<
  'PropositionTechniqueEtFinancièreModifiée-V1',
  {
    identifiantProjet: RawIdentifiantProjet;
    dateSignature: string;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement;
  }
>;

export type DateMiseEnServiceTransmiseEventV1 = DomainEvent<
  'DateMiseEnServiceTransmise-V1',
  {
    dateMiseEnService: string;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement;
    identifiantProjet: RawIdentifiantProjet;
  }
>;

export type DemandeComplèteRaccordementTransmiseEventV1 = DomainEvent<
  'DemandeComplèteDeRaccordementTransmise-V1',
  {
    identifiantProjet: RawIdentifiantProjet;
    identifiantGestionnaireRéseau: RawIdentifiantGestionnaireRéseau;
    dateQualification?: string;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement;
  }
>;

export type PropositionTechniqueEtFinancièreTransmiseEventV1 = DomainEvent<
  'PropositionTechniqueEtFinancièreTransmise-V1',
  {
    dateSignature: string;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement;
    identifiantProjet: RawIdentifiantProjet;
  }
>;

export type RaccordementEvent =
  | AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1
  | DemandeComplèteRaccordementTransmiseEventV1
  | DemandeComplèteRaccordementModifiéeEventV1
  | DemandeComplèteRaccordementModifiéeEventV2
  | RéférenceDossierRacordementModifiéeEventV1
  | PropositionTechniqueEtFinancièreTransmiseEventV1
  | PropositionTechniqueEtFinancièreSignéeTransmiseEventV1
  | PropositionTechniqueEtFinancièreModifiéeEventV1
  | DateMiseEnServiceTransmiseEventV1;
