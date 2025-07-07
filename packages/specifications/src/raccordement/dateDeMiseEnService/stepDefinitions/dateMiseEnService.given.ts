import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../potentiel.world';

EtantDonné(
  'une date de mise en service pour le dossier de raccordement du projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;
    const { dateMiseEnService } = this.raccordementWorld.transmettreDateMiseEnServiceFixture.créer({
      identifiantProjet: identifiantProjet.formatter(),
      référenceDossier,
    });

    try {
      await mediator.send<Lauréat.Raccordement.RaccordementUseCase>({
        type: 'Lauréat.Raccordement.UseCase.TransmettreDateMiseEnService',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          référenceDossierValue: référenceDossier,
          dateMiseEnServiceValue: dateMiseEnService,
          transmiseLeValue: DateTime.now().formatter(),
          transmiseParValue: this.utilisateurWorld.adminFixture.email,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);
