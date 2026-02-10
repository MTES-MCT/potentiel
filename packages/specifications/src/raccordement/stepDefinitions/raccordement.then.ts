import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';

import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from '../../potentiel.world.js';

Alors(
  `le raccordement du projet lauréat devrait être en service pour le projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;
    const { dateMiseEnService } = this.raccordementWorld.transmettreDateMiseEnServiceFixture;

    await waitForExpect(async () => {
      const raccordement = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      assert(Option.isSome(raccordement), 'Aucun raccordement trouvé pour le projet lauréat');

      assert(
        raccordement.miseEnService,
        'Aucune mise en service dans le raccordement du projet lauréat',
      );

      expect(
        raccordement.miseEnService.date.estÉgaleÀ(DateTime.convertirEnValueType(dateMiseEnService)),
      ).to.be.true;
      expect(
        raccordement.miseEnService.référenceDossier.estÉgaleÀ(
          Lauréat.Raccordement.RéférenceDossierRaccordement.convertirEnValueType(référenceDossier),
        ),
      ).to.be.true;
    });
  },
);

Alors(
  `il ne devrait pas y avoir de mise en service dans le raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    await waitForExpect(async () => {
      const raccordement = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      assert(Option.isSome(raccordement), 'Aucun raccordement trouvé pour le projet lauréat');

      expect(raccordement.miseEnService).to.be.undefined;
    });
  },
);
