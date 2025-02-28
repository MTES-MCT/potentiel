import { match } from 'ts-pattern';

import { DomainEvent, InvalidOperationError } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { UtilisateurAggregate } from '../utilisateur.aggregate';
import { Role } from '..';

export type UtilisateurInvitéEvent = DomainEvent<
  'UtilisateurInvité-V1',
  {
    identifiantUtilisateur: Email.RawType;
    invitéLe: DateTime.RawType;
    invitéPar: Email.RawType;
  } & (
    | {
        rôle: Exclude<Role.RawType, 'porteur-projet' | 'dreal' | 'grd' | 'dgec-validateur'>;
      }
    | {
        rôle: 'dgec-validateur';
        fonction: string;
        nomComplet: string;
      }
    | {
        rôle: 'dreal';
        région: string;
      }
    | {
        rôle: 'grd';
        identifiantGestionnaireRéseau: string;
      }
  )
>;

export type InviterOptions = {
  identifiantUtilisateur: Email.ValueType;
  rôle: Role.ValueType;
  invitéLe: DateTime.ValueType;
  invitéPar: Email.ValueType;

  fonction?: string;
  nomComplet?: string;
  région?: string;
  identifiantGestionnaireRéseau?: string;
};

export async function inviter(
  this: UtilisateurAggregate,
  {
    identifiantUtilisateur,
    rôle,
    invitéLe,
    invitéPar,
    fonction,
    nomComplet,
    région,
    identifiantGestionnaireRéseau,
  }: InviterOptions,
) {
  if (this.existe) {
    throw new UtilisateurDéjàExistant();
  }

  const basePayload = {
    identifiantUtilisateur: identifiantUtilisateur.formatter(),
    invitéLe: invitéLe.formatter(),
    invitéPar: invitéPar.formatter(),
  };

  const payload = match(rôle.nom)
    .returnType<UtilisateurInvitéEvent['payload']>()
    .with('dgec-validateur', (rôle) => {
      if (!fonction) {
        throw new FonctionManquanteError();
      }
      if (!nomComplet) {
        throw new NomCompletManquantError();
      }
      return {
        ...basePayload,
        rôle,
        fonction,
        nomComplet,
      };
    })
    .with('dreal', (rôle) => {
      if (!région) {
        throw new RégionManquanteError();
      }
      return {
        ...basePayload,
        rôle,
        région,
      };
    })
    .with('grd', (rôle) => {
      if (!identifiantGestionnaireRéseau) {
        throw new IdentifiantGestionnaireRéseauManquantError();
      }
      return {
        ...basePayload,
        rôle,
        identifiantGestionnaireRéseau,
      };
    })
    .with('porteur-projet', () => {
      // voir `inviterPorteur` behavior
      throw new PorteurInvitéSansProjetErreur();
    })
    .otherwise((rôle) => ({ ...basePayload, rôle }));

  const event: UtilisateurInvitéEvent = {
    type: 'UtilisateurInvité-V1',
    payload,
  };
  await this.publish(event);
}

export function applyUtilisateurInvité(this: UtilisateurAggregate, _: UtilisateurInvitéEvent) {
  this.existe = true;
}

export class UtilisateurDéjàExistant extends InvalidOperationError {
  constructor() {
    super("L'utilisateur existe déjà");
  }
}

export class PorteurInvitéSansProjetErreur extends InvalidOperationError {
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
