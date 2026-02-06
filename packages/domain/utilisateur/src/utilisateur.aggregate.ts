import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { Email } from '@potentiel-domain/common';

import {
  Role,
  UtilisateurInvitéEvent,
  UtilisateurInvitéEventV1,
  UtilisateurRéactivéEvent,
  Utilisateur,
} from './index.js';

import { InviterPorteurOptions } from './inviter/inviterPorteur.options.js';
import { PorteurInvitéEvent } from './inviter/inviterPorteur.event.js';
import { InviterOptions } from './inviter/inviterUtilisateur.options.js';
import { DésactiverOptions } from './désactiver/désactiverUtilisateur.options.js';
import { UtilisateurDésactivéEvent } from './désactiver/désactiverUtilisateur.event.js';
import { ModifierRôleOptions } from './modifierRôle/modifierRôleUtilisateur.options.js';
import { RôleUtilisateurModifiéEvent } from './modifierRôle/modifierRôleUtilisateur.event.js';
import { UtilisateurEvent } from './utilisateur.event.js';
import {
  DésactivationPropreCompteError,
  ModificationMêmesValeursError,
  ModificationPropreRoleRefuséeError,
  ModificationRolePorteurRefuséeError,
  PorteurInvitéSansProjetError,
  UtilisateurDéjàActifError,
  UtilisateurDéjàExistantError,
  UtilisateurInconnuError,
  UtilisateurNonActifError,
  UtilisateurNonPorteurError,
} from './utilisateur.error.js';
import { RéactiverOptions } from './réactiver/réactiverUtilisateur.options.js';

export class UtilisateurAggregate extends AbstractAggregate<UtilisateurEvent, 'utilisateur'> {
  #actif = false;
  #utilisateur: Utilisateur.ValueType | undefined = undefined;
  #projets: Set<string> = new Set();

  get identifiantUtilisateur() {
    return Email.convertirEnValueType(this.aggregateId.split('|')[1]);
  }

  private aAccèsAuProjet(identifiantProjet: string) {
    return this.#projets.has(identifiantProjet);
  }

  async inviter({ invitéLe, invitéPar, utilisateur }: InviterOptions) {
    if (this.exists) {
      throw new UtilisateurDéjàExistantError();
    }

    const payload = utilisateur.formatter();
    if (payload.rôle === 'porteur-projet') {
      throw new PorteurInvitéSansProjetError();
    }
    const event: UtilisateurInvitéEvent = {
      type: 'UtilisateurInvité-V2',
      payload: {
        invitéLe: invitéLe.formatter(),
        invitéPar: invitéPar.formatter(),
        ...payload,
      },
    };
    await this.publish(event);
  }

  async inviterPorteur({ identifiantsProjet, invitéLe, invitéPar }: InviterPorteurOptions) {
    if (this.exists && !this.#utilisateur?.rôle.estPorteur()) {
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

  async modifierRôle({ nouvelUtilisateur, modifiéLe, modifiéPar }: ModifierRôleOptions) {
    if (!this.exists || !this.#utilisateur) {
      throw new UtilisateurInconnuError();
    }

    if (!this.#actif) {
      throw new UtilisateurNonActifError();
    }

    const payload = nouvelUtilisateur.formatter();
    if (payload.rôle === 'porteur-projet' || this.#utilisateur?.estPorteur()) {
      throw new ModificationRolePorteurRefuséeError();
    }

    if (this.identifiantUtilisateur.estÉgaleÀ(modifiéPar)) {
      throw new ModificationPropreRoleRefuséeError();
    }

    if (this.#utilisateur.estÉgaleÀ(nouvelUtilisateur)) {
      throw new ModificationMêmesValeursError();
    }
    const event: RôleUtilisateurModifiéEvent = {
      type: 'RôleUtilisateurModifié-V1',
      payload: {
        modifiéLe: modifiéLe.formatter(),
        modifiéPar: modifiéPar.formatter(),
        ...payload,
      },
    };
    await this.publish(event);
  }

  apply(event: UtilisateurEvent) {
    match(event)
      .with({ type: 'PorteurInvité-V1' }, this.applyPorteurInvité.bind(this))
      .with({ type: 'UtilisateurInvité-V1' }, this.applyUtilisateurInvitéV1.bind(this))
      .with({ type: 'UtilisateurInvité-V2' }, this.applyUtilisateurInvité.bind(this))
      .with({ type: 'UtilisateurDésactivé-V1' }, this.applyUtilisateurDésactivé.bind(this))
      .with({ type: 'UtilisateurRéactivé-V1' }, this.applyUtilisateurRéactivé.bind(this))
      .with({ type: 'RôleUtilisateurModifié-V1' }, this.applyRôleUtilisateurModifié.bind(this))
      .with({ type: 'AccèsProjetRetiré-V1' }, () => {})
      .with({ type: 'ProjetRéclamé-V1' }, () => {})
      .exhaustive();
  }

  applyUtilisateurInvité({ payload }: UtilisateurInvitéEvent) {
    this.#actif = true;
    this.#utilisateur = Utilisateur.convertirEnValueType(payload);
  }

  applyUtilisateurInvitéV1({ payload }: UtilisateurInvitéEventV1) {
    this.#actif = true;
    this.#utilisateur = Utilisateur.convertirEnValueType({
      ...payload,
      ...(payload.rôle === 'acheteur-obligé'
        ? {
            rôle: Role.cocontractant.nom,
            zone: 'métropole',
          }
        : {}),
    });
  }

  applyPorteurInvité({ payload: { identifiantsProjet } }: PorteurInvitéEvent) {
    this.#actif = true;
    this.#utilisateur = Utilisateur.convertirEnValueType({
      identifiantUtilisateur: this.identifiantUtilisateur.formatter(),
      rôle: Role.porteur.nom,
    });
    for (const identifiantProjet of identifiantsProjet) {
      this.#projets.add(identifiantProjet);
    }
  }

  applyRôleUtilisateurModifié({ payload }: RôleUtilisateurModifiéEvent) {
    this.#utilisateur = Utilisateur.convertirEnValueType(payload);
  }

  applyUtilisateurDésactivé(_: UtilisateurDésactivéEvent) {
    this.#actif = false;
  }

  applyUtilisateurRéactivé(_: UtilisateurRéactivéEvent) {
    this.#actif = true;
  }
}
