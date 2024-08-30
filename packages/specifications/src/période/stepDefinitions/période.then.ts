import { Then as Alors } from '@cucumber/cucumber';
import waitForExpect from 'wait-for-expect';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Période } from '@potentiel-domain/periode';
import { Lauréat } from '@potentiel-domain/laureat';
import { Éliminé } from '@potentiel-domain/elimine';

import { PotentielWorld } from '../../potentiel.world';

Alors(
  `la période devrait être notifiée avec les lauréats et les éliminés`,
  async function (this: PotentielWorld) {
    await waitForExpect(
      async () => await vérifierPériode.call(this, this.périodeWorld.identifiantPériode),
    );
  },
);

Alors(
  `les lauréats et éliminés devraient être consultables`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () => {
      await vérifierLauréats.call(this, this.périodeWorld.identifiantPériode);
      await vérifierÉliminés.call(this, this.périodeWorld.identifiantPériode);
    });
  },
);

async function vérifierPériode(
  this: PotentielWorld,
  identifiantPériode: Période.IdentifiantPériode.ValueType,
) {
  const période = await mediator.send<Période.ConsulterPériodeQuery>({
    type: 'Période.Query.ConsulterPériode',
    data: {
      identifiantPériodeValue: identifiantPériode.formatter(),
    },
  });

  const actual = mapToPlainObject(période);
  const expected = mapToPlainObject(this.périodeWorld.mapToExpected(identifiantPériode));

  actual.should.be.deep.equal(expected);
}

async function vérifierLauréats(
  this: PotentielWorld,
  identifiantPériode: Période.IdentifiantPériode.ValueType,
) {
  const période = await mediator.send<Période.ConsulterPériodeQuery>({
    type: 'Période.Query.ConsulterPériode',
    data: {
      identifiantPériodeValue: identifiantPériode.formatter(),
    },
  });

  période.should.not.be.equal(
    Option.none,
    `La période ${identifiantPériode.période} notifiée pour l'appel d'offre ${identifiantPériode.appelOffre}`,
  );

  if (Option.isSome(période)) {
    période.estNotifiée.should.be.true;

    if (période.estNotifiée) {
      for (const identifiantLauréat of période.lauréats) {
        const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
          type: 'Lauréat.Query.ConsulterLauréat',
          data: {
            identifiantProjet: identifiantLauréat.formatter(),
          },
        });

        lauréat.should.not.be.equal(
          Option.none,
          `Aucun lauréat consultable pour ${identifiantLauréat.formatter()}`,
        );
      }
    }
  }
}

async function vérifierÉliminés(
  this: PotentielWorld,
  identifiantPériode: Période.IdentifiantPériode.ValueType,
) {
  const période = await mediator.send<Période.ConsulterPériodeQuery>({
    type: 'Période.Query.ConsulterPériode',
    data: {
      identifiantPériodeValue: identifiantPériode.formatter(),
    },
  });

  période.should.not.be.equal(
    Option.none,
    `La période ${identifiantPériode.période} notifiée pour l'appel d'offre ${identifiantPériode.appelOffre}`,
  );

  if (Option.isSome(période)) {
    période.estNotifiée.should.be.true;

    if (période.estNotifiée) {
      for (const identifiantÉliminé of période.éliminés) {
        const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
          type: 'Éliminé.Query.ConsulterÉliminé',
          data: {
            identifiantProjet: identifiantÉliminé.formatter(),
          },
        });

        éliminé.should.not.be.equal(
          Option.none,
          `Aucun éliminé consultable pour ${identifiantÉliminé.formatter()}`,
        );
      }
    }
  }
}
