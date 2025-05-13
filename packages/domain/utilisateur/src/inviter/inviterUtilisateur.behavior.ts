import { match } from 'ts-pattern';

import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email } from '@potentiel-domain/common';

import { UtilisateurAggregate } from '../utilisateur.aggregate';
import { Role } from '..';
import {
  UtilisateurDéjàExistantError,
  FonctionManquanteError,
  NomCompletManquantError,
  RégionManquanteError,
  IdentifiantGestionnaireRéseauManquantError,
  PorteurInvitéSansProjetError,
} from '../errors';

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
    throw new UtilisateurDéjàExistantError();
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
      throw new PorteurInvitéSansProjetError();
    })
    .otherwise((rôle) => ({ ...basePayload, rôle }));

  const event: UtilisateurInvitéEvent = {
    type: 'UtilisateurInvité-V1',
    payload,
  };
  await this.publish(event);
}

export function applyUtilisateurInvité(
  this: UtilisateurAggregate,
  { payload: { rôle } }: UtilisateurInvitéEvent,
) {
  this.existe = true;
  if (this.existe) {
    this.rôle = Role.convertirEnValueType(rôle);
  }
}
