import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';
import waitForExpect from 'wait-for-expect';
import { match } from 'ts-pattern';

import { CahierDesCharges, Lauréat } from '@potentiel-domain/laureat';
import { mapToPlainObject } from '@potentiel-domain/core';

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
    const cahierDesCharges =
      await mediator.send<CahierDesCharges.ConsulterCahierDesChargesChoisiQuery>({
        type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi',
        data: {
          identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
        },
      });

    const actual = mapToPlainObject(cahierDesCharges);
    const expected = this.lauréatWorld.modifierCahierDesChargesFixture.cahierDesCharges;

    if (expected === 'initial') {
      expect(actual.type).to.eq('initial');
    } else {
      assert(actual.type === 'modifié');
      const [expectedParuLe, expectedAlternatifStr] = expected.split('-');

      const expectedAlternatif = match(expectedAlternatifStr)
        .with('alternatif', () => true)
        .otherwise(() => undefined);

      expect(actual.paruLe === expectedParuLe);
      expect(actual.alternatif === expectedAlternatif);
    }
  });
});
