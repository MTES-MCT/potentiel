import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Puissance } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { PotentielWorld } from '../../../../potentiel.world';

Alors(
  'la puissance du projet lauréat devrait être consultable',
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        this.candidatureWorld.importerCandidature.identifiantProjet,
      );

      const puissance = await mediator.send<Puissance.PuissanceQuery>({
        type: 'Lauréat.Puissance.Query.ConsulterPuissance',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const actual = mapToPlainObject(puissance);
      const expected = mapToPlainObject(
        this.lauréatWorld.puissanceWorld.mapToExpected(identifiantProjet),
      );

      actual.should.be.deep.equal(expected);
    });
  },
);

Alors(
  'la puissance du projet lauréat devrait être mise à jour',
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        this.candidatureWorld.importerCandidature.identifiantProjet,
      );

      const puissance = await mediator.send<Puissance.PuissanceQuery>({
        type: 'Lauréat.Puissance.Query.ConsulterPuissance',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const actual = mapToPlainObject(puissance);
      const expected = mapToPlainObject(
        this.lauréatWorld.puissanceWorld.mapToExpected(identifiantProjet),
      );

      actual.should.be.deep.equal(expected);
    });
  },
);

Alors(
  'la demande de changement de puissance devrait être consultable',
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      await vérifierChangementPuissance.call(
        this,
        this.candidatureWorld.importerCandidature.identifiantProjet,
        Puissance.StatutChangementPuissance.demandé,
      );
    });
  },
);

async function vérifierChangementPuissance(
  this: PotentielWorld,
  identifiantProjet: string,
  statut: Puissance.StatutChangementPuissance.ValueType,
) {
  const demandeEnCours = await mediator.send<Puissance.ConsulterChangementPuissanceQuery>({
    type: 'Lauréat.Puissance.Query.ConsulterChangementPuissance',
    data: {
      identifiantProjet: identifiantProjet,
      demandéLe: this.lauréatWorld.puissanceWorld.demanderChangementPuissanceFixture.demandéLe,
    },
  });

  const actual = mapToPlainObject(demandeEnCours);

  const expected = mapToPlainObject(
    this.lauréatWorld.puissanceWorld.mapDemandeToExpected(
      IdentifiantProjet.convertirEnValueType(identifiantProjet),
      statut,
    ),
  );

  actual.should.be.deep.equal(expected);

  const puissance = await mediator.send<Puissance.ConsulterPuissanceQuery>({
    type: 'Lauréat.Puissance.Query.ConsulterPuissance',
    data: {
      identifiantProjet: identifiantProjet,
    },
  });

  if (statut.estDemandé()) {
    expect(Option.isSome(puissance) && puissance.dateDemandeEnCours).to.be.not.undefined;
  } else {
    expect(Option.isSome(puissance) && puissance.dateDemandeEnCours).to.be.undefined;
  }
}
