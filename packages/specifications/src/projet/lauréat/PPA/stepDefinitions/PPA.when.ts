import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world.js';

Quand(
  `un utilisateur {string} signale un état PPA pour le projet {string}`,
  async function (this: PotentielWorld, rôle: string, projet: string) {
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

      const statut = ['lauréat', 'éliminé'].includes(projet) ? projet : 'inconnu';
      if (statut === 'inconnu') {
        throw new Error(`Statut du projet inconnu : ${projet}`);
      }

      await mediator.send<Lauréat.SignalerPPAUseCase>({
        type: 'Lauréat.UseCase.SignalerPPA',
        data: {
          identifiantProjetValue:
            statut === 'lauréat'
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
