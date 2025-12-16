import { DomainEvent } from '@potentiel-domain/core';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { DateTime, Email } from '@potentiel-domain/common';

import { IdentifiantProjet } from '../..';

import { RéférenceDossierRaccordement } from '.';

//#region Raccordement projet
export type RaccordementSuppriméEvent = DomainEvent<
  'RaccordementSupprimé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;
//#endregion Raccordement du projet

//#region Dossier Raccordement
/**
 * @deprecated Use RéférenceDossierRacordementModifiéeEvent.
 */
export type RéférenceDossierRacordementModifiéeEventV1 = DomainEvent<
  'RéférenceDossierRacordementModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    référenceDossierRaccordementActuelle: RéférenceDossierRaccordement.RawType;
    nouvelleRéférenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
  }
>;

export type RéférenceDossierRacordementModifiéeEvent = DomainEvent<
  'RéférenceDossierRacordementModifiée-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    référenceDossierRaccordementActuelle: RéférenceDossierRaccordement.RawType;
    nouvelleRéférenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    modifiéeLe: DateTime.RawType;
    modifiéePar: Email.RawType;
  }
>;

export type DossierDuRaccordementSuppriméEvent = DomainEvent<
  'DossierDuRaccordementSupprimé-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    référenceDossier: RéférenceDossierRaccordement.RawType;
  }
>;
//#endregion Dossier Raccordement

//#region DCR
/**
 * @deprecated Utilisez DemandeComplèteRaccordementTransmiseEvent à la place.
 * Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type DemandeComplèteRaccordementTransmiseEventV1 = DomainEvent<
  'DemandeComplèteDeRaccordementTransmise-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.RawType;
    dateQualification?: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
  }
>;

/**
 * @deprecated Utilisez DemandeComplèteRaccordementTransmiseEventV2 à la place.
 * Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type DemandeComplèteRaccordementTransmiseEventV2 = DomainEvent<
  'DemandeComplèteDeRaccordementTransmise-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.RawType;
    dateQualification?: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    accuséRéception: {
      format: string;
    };
  }
>;

export type DemandeComplèteRaccordementTransmiseEvent = DomainEvent<
  'DemandeComplèteDeRaccordementTransmise-V3',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.RawType;
    dateQualification?: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    accuséRéception?: {
      format: string;
    };
    transmisePar: Email.RawType;
    transmiseLe: DateTime.RawType;
  }
>;

/**
 * @deprecated Utilisez DemandeComplèteRaccordementTransmiseEventV2 à la place.
 * Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1 = DomainEvent<
  'AccuséRéceptionDemandeComplèteRaccordementTransmis-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    format: string;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
  }
>;

/**
 * @deprecated Utilisez DemandeComplèteRaccordementModifiéeEvent et RéférenceDossierRacordementModifiéeEvent à la place. Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type DemandeComplèteRaccordementModifiéeEventV1 = DomainEvent<
  'DemandeComplèteRaccordementModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateQualification: DateTime.RawType;
    referenceActuelle: RéférenceDossierRaccordement.RawType;
    nouvelleReference: RéférenceDossierRaccordement.RawType;
  }
>;

/**
 * @deprecated Utilisez DemandeComplèteRaccordementModifiéeEvent à la place. Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type DemandeComplèteRaccordementModifiéeEventV2 = DomainEvent<
  'DemandeComplèteRaccordementModifiée-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    dateQualification: DateTime.RawType;
  }
>;

export type DemandeComplèteRaccordementModifiéeEvent = DomainEvent<
  'DemandeComplèteRaccordementModifiée-V3',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    dateQualification: DateTime.RawType;
    accuséRéception: {
      format: string;
    };
  }
>;
//#endregion DCR

//#region PTF
/**
 * @deprecated Utilisez PropositionTechniqueEtFinancièreTransmiseEvent à la place.
 * Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type PropositionTechniqueEtFinancièreTransmiseEventV1 = DomainEvent<
  'PropositionTechniqueEtFinancièreTransmise-V1',
  {
    dateSignature: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

/**
 * @deprecated Utilisez PropositionTechniqueEtFinancièreTransmiseEvent à la place.
 * Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type PropositionTechniqueEtFinancièreSignéeTransmiseEventV1 = DomainEvent<
  'PropositionTechniqueEtFinancièreSignéeTransmise-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    format: string;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
  }
>;

export type PropositionTechniqueEtFinancièreTransmiseEvent = DomainEvent<
  'PropositionTechniqueEtFinancièreTransmise-V2',
  {
    dateSignature: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    propositionTechniqueEtFinancièreSignée: {
      format: string;
    };
  }
>;

/**
 * @deprecated Utilisez PropositionTechniqueEtFinancièreModifiéeEvent à la place. Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type PropositionTechniqueEtFinancièreModifiéeEventV1 = DomainEvent<
  'PropositionTechniqueEtFinancièreModifiée-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateSignature: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
  }
>;

export type PropositionTechniqueEtFinancièreModifiéeEvent = DomainEvent<
  'PropositionTechniqueEtFinancièreModifiée-V2',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateSignature: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    propositionTechniqueEtFinancièreSignée: {
      format: string;
    };
  }
>;
//#endregion PTF

//#region Date mise en service
/**
 * @deprecated Utilisez DateMiseEnServiceTransmiseEvent à la place
 * Ajout de l'information de l'utilisateur ayant fait l'action.
 * Avant V2, seuls les admins pouvaient transmettre la date de MES.
 */
export type DateMiseEnServiceTransmiseV1Event = DomainEvent<
  'DateMiseEnServiceTransmise-V1',
  {
    dateMiseEnService: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

export type DateMiseEnServiceTransmiseEvent = DomainEvent<
  'DateMiseEnServiceTransmise-V2',
  {
    dateMiseEnService: DateTime.RawType;
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    transmiseLe: DateTime.RawType;
    transmisePar: Email.RawType;
  }
>;

export type DateMiseEnServiceSuppriméeEvent = DomainEvent<
  'DateMiseEnServiceSupprimée-V1',
  {
    référenceDossierRaccordement: RéférenceDossierRaccordement.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
    suppriméeLe: DateTime.RawType;
    suppriméePar: Email.RawType;
  }
>;
//#endregion Date mise en service

//#region GRD Raccordement
export type GestionnaireRéseauAttribuéEvent = DomainEvent<
  'GestionnaireRéseauAttribué-V1',
  {
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

export type GestionnaireRéseauInconnuAttribuéEvent = DomainEvent<
  'GestionnaireRéseauInconnuAttribué-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

/**
 * @deprecated Utilisez GestionnaireRéseauRaccordementModifiéEvent et RéférenceDossierRacordementModifiéeEvent à la place. Cet event a été conserver pour la compatibilité avec le chargement des aggrégats et la fonctionnalité de rebuild des projections
 */
export type GestionnaireRéseauProjetModifiéEvent = DomainEvent<
  'GestionnaireRéseauProjetModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.RawType;
  }
>;

export type GestionnaireRéseauRaccordementModifiéEvent = DomainEvent<
  'GestionnaireRéseauRaccordementModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.RawType;
  }
>;
//#endregion GRD Raccordement

export type RaccordementEvent =
  | DemandeComplèteRaccordementTransmiseEventV1
  | DemandeComplèteRaccordementTransmiseEventV2
  | AccuséRéceptionDemandeComplèteRaccordementTransmisEventV1
  | PropositionTechniqueEtFinancièreTransmiseEventV1
  | PropositionTechniqueEtFinancièreSignéeTransmiseEventV1
  | DemandeComplèteRaccordementModifiéeEventV1
  | DemandeComplèteRaccordementModifiéeEventV2
  | PropositionTechniqueEtFinancièreModifiéeEventV1
  | DateMiseEnServiceTransmiseV1Event
  | RéférenceDossierRacordementModifiéeEventV1
  | DemandeComplèteRaccordementTransmiseEvent
  | PropositionTechniqueEtFinancièreTransmiseEvent
  | DateMiseEnServiceTransmiseEvent
  | DateMiseEnServiceSuppriméeEvent
  | DemandeComplèteRaccordementModifiéeEvent
  | RéférenceDossierRacordementModifiéeEvent
  | PropositionTechniqueEtFinancièreModifiéeEvent
  | GestionnaireRéseauRaccordementModifiéEvent
  | GestionnaireRéseauInconnuAttribuéEvent
  | GestionnaireRéseauAttribuéEvent
  | DossierDuRaccordementSuppriméEvent
  | RaccordementSuppriméEvent;
