import { DomainEvent } from '@potentiel/core-domain';
import { RawIdentifiantProjet } from '../projet/projet.valueType';
import { RawRéférenceDossierRaccordement } from './raccordement.valueType';

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

export type RaccordementEvent =
  | DemandeComplèteRaccordementModifiéeEventV1
  | DemandeComplèteRaccordementModifiéeEventV2
  | RéférenceDossierRacordementModifiéeEventV1
  | PropositionTechniqueEtFinancièreModifiéeEventV1;
