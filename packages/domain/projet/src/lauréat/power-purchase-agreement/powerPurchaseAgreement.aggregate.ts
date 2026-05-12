import { match } from 'ts-pattern';

import { AbstractAggregate } from '@potentiel-domain/core';

import { LauréatAggregate } from '../lauréat.aggregate.js';

import { SignalementPowerPurchaseAgreementAnnuléEvent } from './index.js';

import { PowerPurchaseAgreementEvents } from './PowerPurchaseAgreement.events.js';
import { PowerPurchaseAgreementSignaléEvent } from './signaler/PowerPurchaseAgreementSignalé.event.js';
import { SignalerPowerPurchaseAgreementOptions } from './signaler/signalerPowerPurchaseAgreement.option.js';
import {
  PowerPurchaseAgreementDéjàSignaléError,
  PowerPurchaseAgreementNonSignaléError,
} from './PowerPurchaseAgreement.errors.js';
import { AnnulerSignalementPowerPurchaseAgreementOptions } from './annulerSignalement/annulerSignalementPowerPurchaseAgreement.option.js';

export class PowerPurchaseAgreementAggregate extends AbstractAggregate<
  PowerPurchaseAgreementEvents,
  'power-purchase-agreement',
  LauréatAggregate
> {
  #estPartiEnPPA: boolean = false;

  get lauréat() {
    return this.parent;
  }

  private get identifiantProjet() {
    return this.lauréat.projet.identifiantProjet;
  }

  async signalerPowerPurchaseAgreement({
    signaléLe,
    signaléPar,
  }: SignalerPowerPurchaseAgreementOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();

    if (this.#estPartiEnPPA) {
      throw new PowerPurchaseAgreementDéjàSignaléError();
    }

    const event: PowerPurchaseAgreementSignaléEvent = {
      type: 'PowerPurchaseAgreementSignalé-V1',
      payload: {
        identifiantProjet: this.identifiantProjet.formatter(),
        signaléLe: signaléLe.formatter(),
        signaléPar: signaléPar.formatter(),
      },
    };

    await this.publish(event);
  }

  async annulerSignalementPowerPurchaseAgreement({
    annuléLe,
    annuléPar,
  }: AnnulerSignalementPowerPurchaseAgreementOptions) {
    this.lauréat.vérifierQueLeLauréatExiste();

    if (!this.#estPartiEnPPA) {
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
        () => this.applyPowerPurchaseAgreementSignalé(),
      )
      .with(
        {
          type: 'SignalementPowerPurchaseAgreementAnnulé-V1',
        },
        () => this.applySignalementPowerPurchaseAgreementAnnulé(),
      )
      .exhaustive();
  }

  private applyPowerPurchaseAgreementSignalé() {
    this.#estPartiEnPPA = true;
  }

  private applySignalementPowerPurchaseAgreementAnnulé() {
    this.#estPartiEnPPA = false;
  }
}
