import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert } from 'chai';

import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from '../../../../potentiel.world.js';

Alors(
  'le changement enregistré du producteur du projet lauréat devrait être consultable',
  async function (this: PotentielWorld) {
    await vérifierChangementProducteur.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
    );
  },
);

Alors(
  'le producteur du projet lauréat devrait être mis à jour',
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const producteur = await mediator.send<Lauréat.Producteur.ProducteurQuery>({
        type: 'Lauréat.Producteur.Query.ConsulterProducteur',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const actual = mapToPlainObject(producteur);
      const expected = mapToPlainObject(
        this.lauréatWorld.producteurWorld.mapToExpected(
          identifiantProjet,
          this.candidatureWorld.importerCandidature.values.nomCandidatValue,
        ),
      );

      actual.should.be.deep.equal(expected);
    });
  },
);

async function vérifierChangementProducteur(this: PotentielWorld, identifiantProjet: string) {
  return waitForExpect(async () => {
    const demandeEnCours =
      await mediator.send<Lauréat.Producteur.ConsulterChangementProducteurQuery>({
        type: 'Lauréat.Producteur.Query.ConsulterChangementProducteur',
        data: {
          identifiantProjet,
          enregistréLe:
            this.lauréatWorld.producteurWorld.enregistrerChangementProducteurFixture.enregistréLe,
        },
      });

    assert(Option.isSome(demandeEnCours), 'Demande de changement de producteur non trouvée !');

    const actual = mapToPlainObject(demandeEnCours);

    const expected = mapToPlainObject(
      this.lauréatWorld.producteurWorld.mapChangementToExpected(
        IdentifiantProjet.convertirEnValueType(identifiantProjet),
        this.candidatureWorld.importerCandidature.values.nomCandidatValue,
      ),
    );

    actual.should.be.deep.equal(expected);

    const producteur = await mediator.send<Lauréat.Producteur.ConsulterProducteurQuery>({
      type: 'Lauréat.Producteur.Query.ConsulterProducteur',
      data: {
        identifiantProjet,
      },
    });

    assert(Option.isSome(producteur), 'Producteur non trouvée !');
  });
}
