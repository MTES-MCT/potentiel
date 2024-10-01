import { Then as Alors } from '@cucumber/cucumber';
import waitForExpect from 'wait-for-expect';
import { assert } from 'chai';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Période } from '@potentiel-domain/periode';
import { Lauréat } from '@potentiel-domain/laureat';
import { Éliminé } from '@potentiel-domain/elimine';
import { Candidature } from '@potentiel-domain/candidature';

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

  assert(Option.isSome(période));
  assert(période.estNotifiée);
  const candidats = await mediator.send<Candidature.ListerCandidaturesQuery>({
    type: 'Candidature.Query.ListerCandidatures',
    data: {
      appelOffre: identifiantPériode.appelOffre,
      période: identifiantPériode.période,
      statut: 'classé',
    },
  });

  for (const { identifiantProjet } of candidats.items) {
    const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
      type: 'Lauréat.Query.ConsulterLauréat',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    assert(
      Option.isSome(lauréat),
      `Aucun lauréat consultable pour ${identifiantProjet.formatter()}`,
    );
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

  assert(Option.isSome(période));
  assert(période.estNotifiée);

  const candidats = await mediator.send<Candidature.ListerCandidaturesQuery>({
    type: 'Candidature.Query.ListerCandidatures',
    data: {
      appelOffre: identifiantPériode.appelOffre,
      période: identifiantPériode.période,
      statut: 'éliminé',
    },
  });

  for (const { identifiantProjet } of candidats.items) {
    const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
      type: 'Éliminé.Query.ConsulterÉliminé',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    assert(
      Option.isSome(éliminé),
      `Aucun éliminé consultable pour ${identifiantProjet.formatter()}`,
    );
  }
}
