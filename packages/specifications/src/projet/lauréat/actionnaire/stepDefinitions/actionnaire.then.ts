import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Actionnaire } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { PotentielWorld } from '../../../../potentiel.world';
import { convertReadableStreamToString } from '../../../../helpers/convertReadableToString';

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
    await vérifierDemandeChangementActionnaire.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Actionnaire.StatutChangementActionnaire.demandé,
    );
  },
);

Alors(
  "la demande de changement de l'actionnaire devrait être accordée",
  async function (this: PotentielWorld) {
    await vérifierDemandeChangementActionnaire.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Actionnaire.StatutChangementActionnaire.accordé,
    );
  },
);

Alors(
  "la demande de changement de l'actionnaire devrait être rejetée",
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      await vérifierDemandeChangementActionnaire.call(
        this,
        this.candidatureWorld.importerCandidature.identifiantProjet,
        Actionnaire.StatutChangementActionnaire.rejeté,
      );
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

      expect(Option.isNone(actual)).to.be.true;
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

Alors(
  "l'actionnaire du projet lauréat ne devrait pas être mis à jour",
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

async function vérifierDemandeChangementActionnaire(
  this: PotentielWorld,
  identifiantProjet: string,
  statut: Actionnaire.StatutChangementActionnaire.ValueType,
) {
  const demande = await mediator.send<Actionnaire.ConsulterChangementActionnaireQuery>({
    type: 'Lauréat.Actionnaire.Query.ConsulterChangementActionnaire',
    data: {
      identifiantProjet: identifiantProjet,
    },
  });

  const actual = mapToPlainObject(demande);
  const expected = mapToPlainObject(
    this.lauréatWorld.actionnaireWorld.mapDemandeToExpected(
      IdentifiantProjet.convertirEnValueType(identifiantProjet),
      statut,
    ),
  );

  if (Option.isSome(actual)) {
    console.log(actual.demande.rejet);
  }

  actual.should.be.deep.equal(expected);

  if (this.lauréatWorld.actionnaireWorld.accorderDemandeChangementActionnaireFixture.aÉtéCréé) {
    const result = await mediator.send<ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: Option.match(demande)
          .some(({ demande: { accord } }) => accord?.réponseSignée?.formatter() ?? '')
          .none(() => ''),
      },
    });

    const actualContent = await convertReadableStreamToString(result.content);
    const expectedContent = await convertReadableStreamToString(
      this.lauréatWorld.actionnaireWorld.accorderDemandeChangementActionnaireFixture.réponseSignée
        ?.content ?? new ReadableStream(),
    );
    expect(actualContent).to.be.equal(expectedContent);
  }

  if (this.lauréatWorld.actionnaireWorld.rejeterDemandeChangementActionnaireFixture.aÉtéCréé) {
    const result = await mediator.send<ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: Option.match(demande)
          .some(({ demande: { rejet } }) => rejet?.réponseSignée?.formatter() ?? '')
          .none(() => ''),
      },
    });

    const actualContent = await convertReadableStreamToString(result.content);
    const expectedContent = await convertReadableStreamToString(
      this.lauréatWorld.actionnaireWorld.rejeterDemandeChangementActionnaireFixture.réponseSignée
        ?.content ?? new ReadableStream(),
    );
    expect(actualContent).to.be.equal(expectedContent);
  }
}
