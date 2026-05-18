import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';

import type { LauréatAggregate } from '../lauréat.aggregate.js';
import type { AnnulerSignalementPowerPurchaseAgreementOptions } from './annulerSignalement/annulerSignalementPowerPurchaseAgreement.option.js';
import type { SignalementPowerPurchaseAgreementAnnuléEvent } from './index.js';
import {
  PowerPurchaseAgreementDéjàSignaléError,
  PowerPurchaseAgreementNonSignaléError,
} from './PowerPurchaseAgreement.errors.js';
import type { PowerPurchaseAgreementEvents } from './PowerPurchaseAgreement.events.js';
import type { PowerPurchaseAgreementSignaléEvent } from './signaler/PowerPurchaseAgreementSignalé.event.js';
import type { SignalerPowerPurchaseAgreementOptions } from './signaler/signalerPowerPurchaseAgreement.option.js';

export class PowerPurchaseAgreementAggregate extends AbstractAggregate<
  PowerPurchaseAgreementEvents,
  'power-purchase-agreement',
  LauréatAggregate
> {
  #PPA:
    | {
        rôleUtilisateur: Role.RawType;
      }
    | undefined = undefined;

  get aÉtéSignaléParLePorteur() {
    return this.#PPA?.rôleUtilisateur === 'porteur-projet';
  }

  private get lauréat() {
    return this.parent;
  }

  private get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }

  async signaler({
    signaléLe,
    signaléPar,
    rôleUtilisateur,
  }: SignalerPowerPurchaseAgreementOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();

    if (this.#PPA) {
      throw new PowerPurchaseAgreementDéjàSignaléError();
    }

    const event: PowerPurchaseAgreementSignaléEvent = {
      type: 'PowerPurchaseAgreementSignalé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        signaléLe: signaléLe.formatter(),
        signaléPar: signaléPar.formatter(),
        rôleUtilisateur: rôleUtilisateur.nom,
      },
    };

    await this.publish(event);
  }

  async annulerSignalementPowerPurchaseAgreement({
    annuléLe,
    annuléPar,
  }: AnnulerSignalementPowerPurchaseAgreementOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();

    if (!this.#PPA) {
      throw new PowerPurchaseAgreementNonSignaléError();
    }

    const event: SignalementPowerPurchaseAgreementAnnuléEvent = {
      type: 'SignalementPowerPurchaseAgreementAnnulé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        annuléLe: annuléLe.formatter(),
        annuléPar: annuléPar.formatter(),
      },
    };

    await this.publish(event);
  }

  apply(event: PowerPurchaseAgreementEvents): void {
    match(event)
      .with(
        {
          type: 'PowerPurchaseAgreementSignalé-V1',
        },
        this.applyPowerPurchaseAgreementSignalé.bind(this),
      )
      .with(
        {
          type: 'SignalementPowerPurchaseAgreementAnnulé-V1',
        },
        () => this.applySignalementPowerPurchaseAgreementAnnulé(),
      )
      .exhaustive();
  }

  private applyPowerPurchaseAgreementSignalé({ payload }: PowerPurchaseAgreementSignaléEvent) {
    this.#PPA = {
      rôleUtilisateur: payload.rôleUtilisateur,
    };
  }

  private applySignalementPowerPurchaseAgreementAnnulé() {
    this.#PPA = undefined;
  }
}
