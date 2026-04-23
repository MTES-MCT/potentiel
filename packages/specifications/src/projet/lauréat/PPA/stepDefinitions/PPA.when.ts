import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world.js';

Quand(
  `un utilisateur {string} signale un état PPA pour le projet lauréat`,
  async function (this: PotentielWorld, rôle: string) {
    try {
      const utilisateur =
        rôle === 'dgec'
          ? this.utilisateurWorld.dgecFixture.email
          : this.utilisateurWorld.drealFixture.email;

      await mediator.send<Lauréat.SignalerPPAUseCase>({
        type: 'Lauréat.UseCase.SignalerPPA',
        data: {
          identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
          signaléLeValue: new Date().toISOString(),
          signaléParValue: utilisateur,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);
