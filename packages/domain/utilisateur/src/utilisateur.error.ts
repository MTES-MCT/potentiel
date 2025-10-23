import { InvalidOperationError, OperationRejectedError } from '@potentiel-domain/core';

export class UtilisateurInconnuError extends InvalidOperationError {
  constructor() {
    super(`L'utilisateur n'est pas référencé`);
  }
}

export class RoleRefuséError extends OperationRejectedError {
  constructor(value: string) {
    super(`Le rôle ne correspond à aucune valeur connue`, {
      value,
    });
  }
}

export class AccèsFonctionnalitéRefuséError extends OperationRejectedError {
  constructor(fonctionnalité: string, role: string) {
    super(`Accès à la fonctionnalité refusé`, {
      fonctionnalité,
      role,
    });
  }
}

export class UtilisateurNonPorteurError extends InvalidOperationError {
  constructor() {
    super(`L'utilisateur ne peut être invité sur ce projet`);
  }
}

export class UtilisateurDéjàExistantError extends InvalidOperationError {
  constructor() {
    super("L'utilisateur existe déjà");
  }
}

export class PorteurInvitéSansProjetError extends InvalidOperationError {
  constructor() {
    super(`Il est impossible d'inviter un porteur sans projet`);
  }
}

export class FonctionManquanteError extends InvalidOperationError {
  constructor() {
    super('La fonction est obligatoire pour un utilisateur dgec-validateur');
  }
}

export class NomCompletManquantError extends InvalidOperationError {
  constructor() {
    super('Le nom complet est obligatoire pour un utilisateur dgec-validateur');
  }
}

export class RégionManquanteError extends InvalidOperationError {
  constructor() {
    super('La région est obligatoire pour un utilisateur dreal');
  }
}

export class IdentifiantGestionnaireRéseauManquantError extends InvalidOperationError {
  constructor() {
    super(`L'identifiant du gestionnaire de réseau est obligatoire pour un utilisateur grd`);
  }
}

export class ZoneManquanteError extends InvalidOperationError {
  constructor() {
    super(`La zone est obligatoire pour un utilisateur cocontractant`);
  }
}

export class DésactivationPropreCompteError extends InvalidOperationError {
  constructor() {
    super(`Il est impossible de désactiver son propre compte`);
  }
}

export class UtilisateurNonActifError extends InvalidOperationError {
  constructor() {
    super(`L'utilisateur n'est pas actif`);
  }
}

export class UtilisateurDéjàActifError extends InvalidOperationError {
  constructor() {
    super(`L'utilisateur est déjà actif`);
  }
}
