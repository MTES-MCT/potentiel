import { match, P } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { Email } from '@potentiel-domain/common';

import {
  Role,
  SpécificitésRoleEventPayload,
  UtilisateurInvitéEvent,
  UtilisateurRéactivéEvent,
} from '.';

import { InviterPorteurOptions } from './inviter/inviterPorteur.options';
import { PorteurInvitéEvent } from './inviter/inviterPorteur.event';
import { InviterOptions } from './inviter/inviterUtilisateur.options';
import { DésactiverOptions } from './désactiver/désactiverUtilisateur.options';
import { UtilisateurDésactivéEvent } from './désactiver/désactiverUtilisateur.event';
import { ModifierRôleOptions } from './modifierRôle/modifierRôleUtilisateur.options';
import { RoleUtilisateurModifiéEvent } from './modifierRôle/modifierRôleUtilisateur.event';
import { UtilisateurEvent } from './utilisateur.event';
import {
  DésactivationPropreCompteError,
  FonctionManquanteError,
  IdentifiantGestionnaireRéseauManquantError,
  ModificationPropreRoleRefuséeError,
  ModificationRolePorteurRefuséeError,
  NomCompletManquantError,
  PorteurInvitéSansProjetError,
  RégionManquanteError,
  UtilisateurDéjàActifError,
  UtilisateurDéjàExistantError,
  UtilisateurInconnuError,
  UtilisateurNonActifError,
  UtilisateurNonPorteurError,
  ZoneManquanteError,
} from './utilisateur.error';
import { RéactiverOptions } from './réactiver/réactiverUtilisateur.options';

export class UtilisateurAggregate extends AbstractAggregate<UtilisateurEvent, 'utilisateur'> {
  #actif = false;
  #rôle: Role.ValueType | undefined = undefined;
  #projets: Set<string> = new Set();

  get identifiantUtilisateur() {
    return Email.convertirEnValueType(this.aggregateId.split('|')[1]);
  }

  private aAccèsAuProjet(identifiantProjet: string) {
    return this.#projets.has(identifiantProjet);
  }

  async inviter(options: InviterOptions) {
    const { invitéLe, invitéPar } = options;
    if (this.exists) {
      throw new UtilisateurDéjàExistantError();
    }

    const event: UtilisateurInvitéEvent = {
      type: 'UtilisateurInvité-V1',
      payload: {
        identifiantUtilisateur: this.identifiantUtilisateur.formatter(),
        invitéLe: invitéLe.formatter(),
        invitéPar: invitéPar.formatter(),
        ...this.mapToSpécificitésRolePayload(options),
      },
    };
    await this.publish(event);
  }

  async inviterPorteur({ identifiantsProjet, invitéLe, invitéPar }: InviterPorteurOptions) {
    if (this.exists && !this.#rôle?.estÉgaleÀ(Role.porteur)) {
      throw new UtilisateurNonPorteurError();
    }

    const event: PorteurInvitéEvent = {
      type: 'PorteurInvité-V1',
      payload: {
        identifiantsProjet: identifiantsProjet.filter(
          (identifiantProjet) => !this.aAccèsAuProjet(identifiantProjet),
        ),
        identifiantUtilisateur: this.identifiantUtilisateur.formatter(),
        invitéLe: invitéLe.formatter(),
        invitéPar: invitéPar.formatter(),
      },
    };

    await this.publish(event);
  }

  async désactiver({ désactivéLe, désactivéPar }: DésactiverOptions) {
    if (!this.exists) {
      throw new UtilisateurInconnuError();
    }
    if (!this.#actif) {
      throw new UtilisateurNonActifError();
    }
    if (this.identifiantUtilisateur.estÉgaleÀ(désactivéPar)) {
      throw new DésactivationPropreCompteError();
    }

    const event: UtilisateurDésactivéEvent = {
      type: 'UtilisateurDésactivé-V1',
      payload: {
        identifiantUtilisateur: this.identifiantUtilisateur.formatter(),
        désactivéLe: désactivéLe.formatter(),
        désactivéPar: désactivéPar.formatter(),
      },
    };
    await this.publish(event);
  }

  async réactiver({ réactivéLe, réactivéPar }: RéactiverOptions) {
    if (!this.exists) {
      throw new UtilisateurInconnuError();
    }
    if (this.#actif) {
      throw new UtilisateurDéjàActifError();
    }

    const event: UtilisateurRéactivéEvent = {
      type: 'UtilisateurRéactivé-V1',
      payload: {
        identifiantUtilisateur: this.identifiantUtilisateur.formatter(),
        réactivéLe: réactivéLe.formatter(),
        réactivéPar: réactivéPar.formatter(),
      },
    };
    await this.publish(event);
  }

  async modifierRôle(options: ModifierRôleOptions) {
    const { modifiéLe, modifiéPar } = options;
    if (!this.exists) {
      throw new UtilisateurInconnuError();
    }

    if (!this.#actif) {
      throw new UtilisateurNonActifError();
    }

    if (options.rôle.estPorteur() || this.#rôle?.estPorteur()) {
      throw new ModificationRolePorteurRefuséeError();
    }

    if (this.identifiantUtilisateur.estÉgaleÀ(modifiéPar)) {
      throw new ModificationPropreRoleRefuséeError();
    }

    const event: RoleUtilisateurModifiéEvent = {
      type: 'RoleUtilisateurModifié-V1',
      payload: {
        identifiantUtilisateur: this.identifiantUtilisateur.formatter(),
        modifiéLe: modifiéLe.formatter(),
        modifiéPar: modifiéPar.formatter(),
        ...this.mapToSpécificitésRolePayload(options),
      },
    };
    await this.publish(event);
  }

  private mapToSpécificitésRolePayload({
    rôle,
    fonction,
    identifiantGestionnaireRéseau,
    nomComplet,
    région,
    zone,
  }: Omit<InviterOptions, 'invitéLe' | 'invitéPar'>) {
    return match(rôle.nom)
      .returnType<SpécificitésRoleEventPayload>()
      .with('dgec-validateur', (rôle) => {
        if (!fonction) {
          throw new FonctionManquanteError();
        }
        if (!nomComplet) {
          throw new NomCompletManquantError();
        }
        return {
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
          rôle,
          région: région.formatter(),
        };
      })
      .with('grd', (rôle) => {
        if (!identifiantGestionnaireRéseau) {
          throw new IdentifiantGestionnaireRéseauManquantError();
        }
        return {
          rôle,
          identifiantGestionnaireRéseau,
        };
      })
      .with('porteur-projet', () => {
        // voir `inviterPorteur` behavior
        throw new PorteurInvitéSansProjetError();
      })
      .with('cocontractant', (rôle) => {
        if (!zone) {
          throw new ZoneManquanteError();
        }
        return {
          rôle,
          zone: zone.formatter(),
        };
      })
      .with(P.union('admin', 'cre', 'ademe', 'caisse-des-dépôts', 'acheteur-obligé'), (rôle) => ({
        rôle,
      }))
      .exhaustive();
  }

  apply(event: UtilisateurEvent) {
    match(event)
      .with({ type: 'PorteurInvité-V1' }, this.applyPorteurInvité.bind(this))
      .with({ type: 'UtilisateurInvité-V1' }, this.applyUtilisateurInvité.bind(this))
      .with({ type: 'UtilisateurDésactivé-V1' }, this.applyUtilisateurDésactivé.bind(this))
      .with({ type: 'UtilisateurRéactivé-V1' }, this.applyUtilisateurRéactivé.bind(this))
      .with({ type: 'RoleUtilisateurModifié-V1' }, this.applyRoleUtilisateurModifié.bind(this))
      .with({ type: 'AccèsProjetRetiré-V1' }, () => {})
      .with({ type: 'ProjetRéclamé-V1' }, () => {})
      .exhaustive();
  }

  applyUtilisateurInvité({ payload: { rôle } }: UtilisateurInvitéEvent) {
    this.#actif = true;
    this.#rôle = Role.convertirEnValueType(rôle);
  }

  applyPorteurInvité({ payload: { identifiantsProjet } }: PorteurInvitéEvent) {
    this.#actif = true;
    this.#rôle = Role.porteur;
    for (const identifiantProjet of identifiantsProjet) {
      this.#projets.add(identifiantProjet);
    }
  }

  applyUtilisateurDésactivé(_: UtilisateurDésactivéEvent) {
    this.#actif = false;
  }
  applyUtilisateurRéactivé(_: UtilisateurRéactivéEvent) {
    this.#actif = true;
  }

  applyRoleUtilisateurModifié({ payload: { rôle } }: RoleUtilisateurModifiéEvent) {
    this.#rôle = Role.convertirEnValueType(rôle);
  }
}
