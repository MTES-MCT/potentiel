import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world.js';

Quand(
  `un utilisateur {string} signale un état PPA pour le projet {lauréat-éliminé}`,
  async function (this: PotentielWorld, rôle: string, statutProjet: 'lauréat' | 'éliminé') {
    try {
      const utilisateur =
        rôle === 'dgec'
          ? this.utilisateurWorld.dgecFixture.email
          : rôle === 'dreal'
            ? this.utilisateurWorld.drealFixture.email
            : 'inconnu';
      if (utilisateur === 'inconnu') {
        throw new Error(`Rôle utilisateur inconnu : ${rôle}`);
      }

      await mediator.send<Lauréat.PowerPurchaseAgreement.SignalerPowerPurchaseAgreementUseCase>({
        type: 'Lauréat.PowerPurchaseAgreement.UseCase.SignalerPowerPurchaseAgreement',
        data: {
          identifiantProjetValue:
            statutProjet === 'lauréat'
              ? this.lauréatWorld.identifiantProjet.formatter()
              : this.éliminéWorld.identifiantProjet.formatter(),
          signaléLeValue: new Date().toISOString(),
          signaléParValue: utilisateur,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `un utilisateur {string} annule un état PPA pour le projet {lauréat-éliminé}`,
  async function (this: PotentielWorld, rôle: string, statutProjet: 'lauréat' | 'éliminé') {
    try {
      const utilisateur =
        rôle === 'dgec'
          ? this.utilisateurWorld.dgecFixture.email
          : rôle === 'dreal'
            ? this.utilisateurWorld.drealFixture.email
            : 'inconnu';
      if (utilisateur === 'inconnu') {
        throw new Error(`Rôle utilisateur inconnu : ${rôle}`);
      }

      await mediator.send<Lauréat.PowerPurchaseAgreement.AnnulerPowerPurchaseAgreementUseCase>({
        type: 'Lauréat.PowerPurchaseAgreement.UseCase.AnnulerPowerPurchaseAgreement',
        data: {
          identifiantProjetValue:
            statutProjet === 'lauréat'
              ? this.lauréatWorld.identifiantProjet.formatter()
              : this.éliminéWorld.identifiantProjet.formatter(),
          annuléLeValue: new Date().toISOString(),
          annuléParValue: utilisateur,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);
