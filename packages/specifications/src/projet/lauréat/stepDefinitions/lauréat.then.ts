import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { expect } from 'chai';
import waitForExpect from 'wait-for-expect';

import { Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { PotentielWorld } from '../../../potentiel.world';

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
    const cahierDesCharges = await mediator.send<Lauréat.ConsulterCahierDesChargesChoisiQuery>({
      type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi',
      data: {
        identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      },
    });

    const actual = mapToPlainObject(cahierDesCharges);
    const expected = mapToPlainObject(
      AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(
        this.lauréatWorld.choisirCahierDesChargesFixture.cahierDesCharges,
      ),
    );

    // expected is a subset of actual, which contains additional properties, irrelevant in the assertion
    expect(actual).to.deep.contain(expected);
  });
});
