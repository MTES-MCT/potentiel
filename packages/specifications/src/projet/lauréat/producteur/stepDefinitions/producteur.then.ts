import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Producteur } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';

Alors(
  'le producteur du projet lauréat devrait être consultable',
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        this.candidatureWorld.importerCandidature.identifiantProjet,
      );

      const producteur = await mediator.send<Producteur.ProducteurQuery>({
        type: 'Lauréat.Producteur.Query.ConsulterProducteur',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const actual = mapToPlainObject(producteur);
      const expected = mapToPlainObject(
        this.lauréatWorld.producteurWorld.mapToExpected(identifiantProjet),
      );

      actual.should.be.deep.equal(expected);
    });
  },
);
