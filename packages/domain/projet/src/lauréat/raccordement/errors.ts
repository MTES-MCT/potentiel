import { InvalidOperationError } from '@potentiel-domain/core';
import type { GestionnaireRéseau } from '@potentiel-domain/reseau';

import type { IdentifiantProjet } from '../../index.js';

export class DateDansLeFuturError extends InvalidOperationError {
  constructor() {
    super(`La date ne peut pas être une date future`);
  }
}

export class DossierNonRéférencéPourLeRaccordementDuProjetError extends InvalidOperationError {
  constructor() {
    super(`Le dossier n'est pas référencé dans le raccordement de ce projet`);
  }
}

export class FormatRéférenceDossierRaccordementInvalideError extends InvalidOperationError {
  constructor() {
    super(`Le format de la référence du dossier de raccordement est invalide`);
  }
}

export class DemandeComplèteDeRaccordementNonModifiéeError extends InvalidOperationError {
  constructor() {
    super("Aucune modification n'a été apportée à la demande complète de raccordement");
  }
}

export class DocumentRaccordementDéjàTransmisError extends InvalidOperationError {
  constructor() {
    super(`Ce document a déjà été transmis pour ce dossier de raccordement`);
  }
}

export class TypeDeDocumentRaccordementIncompatibleError extends InvalidOperationError {
  constructor() {
    super(
      `Ce type document est incompatible avec celui ou ceux déjà transmis pour ce dossier de raccordement`,
    );
  }
}

export class DocumentRaccordementNonModifiéError extends InvalidOperationError {
  constructor() {
    super("Aucune modification n'a été apportée au document");
  }
}

export class GestionnaireRéseauDéjàExistantError extends InvalidOperationError {
  constructor(identifiantProjet: IdentifiantProjet.RawType) {
    super(`Un gestionnaire réseau existe déjà pour ce projet`, {
      identifiantProjet,
    });
  }
}

export class RéférenceDossierRaccordementDéjàExistantePourLeProjetError extends InvalidOperationError {
  constructor() {
    super(
      `Il est impossible d'avoir plusieurs dossiers de raccordement avec la même référence pour un projet`,
    );
  }
}

export class DossierMisEnServiceNonSupprimableError extends InvalidOperationError {
  constructor() {
    super(`Un dossier avec une date de mise en service ne peut pas être supprimé`);
  }
}

export class GestionnaireRéseauIdentiqueError extends InvalidOperationError {
  constructor(
    identifiantProjet: IdentifiantProjet.ValueType,
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType,
  ) {
    super(`Ce gestionnaire de réseau est déjà déclaré pour le dossier de raccordement`, {
      identifiantProjet: identifiantProjet.formatter(),
      identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
    });
  }
}

export class GestionnaireRéseauNonModifiableCarRaccordementAvecDateDeMiseEnServiceError extends InvalidOperationError {
  constructor() {
    super(
      `Le gestionnaire de réseau ne peut être modifié car le raccordement a une date de mise en service`,
    );
  }
}

export class DateMiseEnServiceAntérieureDateDésignationProjetError extends InvalidOperationError {
  constructor() {
    super(
      `La date de mise en service ne peut pas être antérieure à la date de désignation du projet`,
    );
  }
}

export class DateMiseEnServiceDéjàTransmiseError extends InvalidOperationError {
  constructor() {
    super(`La date de mise en service a déjà été transmise pour ce dossier de raccordement`);
  }
}

export class DateDeMiseEnServiceNonModifiéeError extends InvalidOperationError {
  constructor() {
    super(
      `Aucune modification n'a été apportée à la date de mise en service de ce dossier de raccordement`,
    );
  }
}

export class DemandeComplèteRaccordementNonModifiableCarDossierMisEnServiceError extends InvalidOperationError {
  constructor() {
    super(
      `La demande complète de raccordement du dossier ne peut pas être modifiée car celui-ci dispose déjà d'une date de mise en service`,
    );
  }
}

export class DocumentNonModifiableCarDossierMisEnServiceError extends InvalidOperationError {
  constructor() {
    super(
      `Ce document du dossier de raccordement ne peut pas être modifié car celui-ci est déjà mis en service`,
    );
  }
}

export class RéférenceDossierRaccordementNonModifiableCarDossierMisEnServiceError extends InvalidOperationError {
  constructor(référenceDossier: string) {
    super(
      `La référence du dossier de raccordement ${référenceDossier} ne peut pas être modifiée car le dossier dispose déjà d'une date de mise en service`,
    );
  }
}
export class RéférencesDossierRaccordementIdentiquesError extends InvalidOperationError {
  constructor() {
    super(`Les références du dossier de raccordement sont identiques`);
  }
}

export class DossierRaccordementPasEnServiceError extends InvalidOperationError {
  constructor() {
    super(`Le dossier de raccordement n'est pas en service`);
  }
}

// OLD

export class PropositionTechniqueEtFinancièreNonModifiableCarDossierMisEnServiceError extends InvalidOperationError {
  constructor() {
    super(
      `La proposition technique et financière du dossier ne peut pas être modifiée car celui-ci dispose déjà d'une date de mise en service`,
    );
  }
}

export class PropositionTechniqueEtFinancièreNonModifiéeError extends InvalidOperationError {
  constructor() {
    super("Aucune modification n'a été apportée à la proposition technique et financière");
  }
}
