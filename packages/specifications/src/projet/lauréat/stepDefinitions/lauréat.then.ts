import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';

import { Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from '../../../potentiel.world.js';

Alors('le projet lauréat devrait être consultable', async function (this: PotentielWorld) {
  await waitForExpect(async () => {
    const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
      type: 'Lauréat.Query.ConsulterLauréat',
      data: {
        identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      },
    });

    const actual = mapToPlainObject(lauréat);
    const expected = mapToPlainObject(this.lauréatWorld.mapToExpected());

    expect(actual).to.deep.eq(expected);
  });
});

Alors('le cahier des charges devrait être modifié', async function (this: PotentielWorld) {
  await waitForExpect(async () => {
    const cahierDesCharges = await mediator.send<Lauréat.ConsulterCahierDesChargesQuery>({
      type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesCharges',
      data: {
        identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
      },
    });

    const actual = mapToPlainObject(
      Option.match(cahierDesCharges)
        .some((cdc) => cdc.cahierDesChargesModificatif ?? { type: 'initial' })
        .none(),
    );
    const expected = mapToPlainObject(
      AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(
        this.lauréatWorld.choisirCahierDesChargesFixture.cahierDesCharges,
      ),
    );

    // expected is a subset of actual, which contains additional properties, irrelevant in the assertion
    expect(actual).to.deep.contain(expected);
  });
});

Alors(
  `le statut du projet lauréat devrait être {string}`,
  async function (this: PotentielWorld, statut: 'abandonné' | 'achevé') {
    await waitForExpect(async () => {
      const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
        type: 'Lauréat.Query.ConsulterLauréat',
        data: {
          identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
        },
      });

      assert(Option.isSome(lauréat), "Le projet lauréat n'existe pas");

      if (statut === 'abandonné') {
        expect(lauréat.statut.estAbandonné()).to.be.true;
      }

      if (statut === 'achevé') {
        expect(lauréat.statut.estAchevé()).to.be.true;
      }
    });
  },
);
