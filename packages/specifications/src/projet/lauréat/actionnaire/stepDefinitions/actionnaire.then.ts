import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Actionnaire } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { PotentielWorld } from '../../../../potentiel.world';

Alors(
  "l'actionnaire du projet lauréat devrait être consultable",
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        this.candidatureWorld.importerCandidature.identifiantProjet,
      );
      const actionnaire = await mediator.send<Actionnaire.ActionnaireQuery>({
        type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const actual = mapToPlainObject(actionnaire);
      const expected = mapToPlainObject(
        this.lauréatWorld.actionnaireWorld.mapToExpected(identifiantProjet),
      );

      actual.should.be.deep.equal(expected);
    });
  },
);

Alors(
  "la demande de changement de l'actionnaire devrait être consultable",
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        this.candidatureWorld.importerCandidature.identifiantProjet,
      );

      const demande = await mediator.send<Actionnaire.ActionnaireQuery>({
        type: 'Lauréat.Actionnaire.Query.ConsulterChangementActionnaire',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const actual = mapToPlainObject(demande);
      const expected = mapToPlainObject(
        this.lauréatWorld.actionnaireWorld.demanderChangementActionnaireFixture.mapToExpected(
          identifiantProjet,
        ),
      );

      actual.should.be.deep.equal(expected);
    });
  },
);

Alors(
  "la demande de changement de l'actionnaire ne devrait plus être consultable",
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        this.candidatureWorld.importerCandidature.identifiantProjet,
      );

      const actual = await mediator.send<Actionnaire.ActionnaireQuery>({
        type: 'Lauréat.Actionnaire.Query.ConsulterChangementActionnaire',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      expect(Option.isNone(actual));
    });
  },
);

Alors(
  "l'actionnaire du projet lauréat devrait être mis à jour",
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const actionnaire = await mediator.send<Actionnaire.ActionnaireQuery>({
        type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const actual = mapToPlainObject(actionnaire);
      const expected = mapToPlainObject(
        this.lauréatWorld.actionnaireWorld.mapToExpected(identifiantProjet),
      );

      actual.should.be.deep.equal(expected);
    });
  },
);
