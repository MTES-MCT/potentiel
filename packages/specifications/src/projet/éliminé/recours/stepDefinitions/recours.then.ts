import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { expect } from 'chai';

import { Option } from '@potentiel-libraries/monads';
import { Recours } from '@potentiel-domain/elimine';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { PotentielWorld } from '../../../../potentiel.world';
import { convertReadableStreamToString } from '../../../../helpers/convertReadableToString';

Alors(
  /le recours du projet éliminé devrait être(.*)demandé/,
  async function (this: PotentielWorld, etat: string) {
    if (etat.includes('de nouveau')) {
      this.eliminéWorld.recoursWorld.reinitialiserEnDemande();
    }

    await waitForExpect(async () =>
      vérifierRecours.call(
        this,
        this.eliminéWorld.identifiantProjet,
        Recours.StatutRecours.demandé,
      ),
    );
  },
);

Alors(
  `le recours du projet éliminé ne devrait plus exister`,
  async function (this: PotentielWorld) {
    const identifiantProjet = this.eliminéWorld.identifiantProjet.formatter();

    await waitForExpect(async () => {
      const result = await mediator.send<Recours.ConsulterRecoursQuery>({
        type: 'Éliminé.Recours.Query.ConsulterRecours',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

      expect(Option.isNone(result)).to.be.true;
    });
  },
);

Alors(`le recours du projet éliminé devrait être rejeté`, async function (this: PotentielWorld) {
  await waitForExpect(async () =>
    vérifierRecours.call(this, this.eliminéWorld.identifiantProjet, Recours.StatutRecours.rejeté),
  );
});

Alors(`le recours du projet éliminé devrait être accordé`, async function (this: PotentielWorld) {
  await waitForExpect(async () =>
    vérifierRecours.call(this, this.eliminéWorld.identifiantProjet, Recours.StatutRecours.accordé),
  );
});

Alors(
  `la demande de recours du projet éliminé devrait être en instruction`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () =>
      vérifierRecours.call(
        this,
        this.eliminéWorld.identifiantProjet,
        Recours.StatutRecours.enInstruction,
      ),
    );
  },
);

async function vérifierRecours(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  statut: Recours.StatutRecours.ValueType,
) {
  const recours = await mediator.send<Recours.ConsulterRecoursQuery>({
    type: 'Éliminé.Recours.Query.ConsulterRecours',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
    },
  });

  const actual = mapToPlainObject(recours);
  const expected = mapToPlainObject(
    this.eliminéWorld.recoursWorld.mapToExpected(identifiantProjet, statut),
  );

  actual.should.be.deep.equal(expected);

  const pièceJustificative = await mediator.send<ConsulterDocumentProjetQuery>({
    type: 'Document.Query.ConsulterDocumentProjet',
    data: {
      documentKey: Option.match(recours)
        .some<string>(({ demande: { pièceJustificative: piéceJustificative } }) =>
          piéceJustificative.formatter(),
        )
        .none(() => ''),
    },
  });

  const actualPièceJustificativeContent = await convertReadableStreamToString(
    pièceJustificative.content,
  );
  const expectedPièceJustificativeContent = await convertReadableStreamToString(
    this.eliminéWorld.recoursWorld.demanderRecoursFixture.pièceJustificative.content,
  );

  expect(actualPièceJustificativeContent).to.be.equal(expectedPièceJustificativeContent);

  if (this.eliminéWorld.recoursWorld.accorderRecoursFixture.aÉtéCréé) {
    const result = await mediator.send<ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: Option.match(recours)
          .some(({ demande: { accord } }) => accord?.réponseSignée?.formatter() ?? '')
          .none(() => ''),
      },
    });

    const actualContent = await convertReadableStreamToString(result.content);
    const expectedContent = await convertReadableStreamToString(
      this.eliminéWorld.recoursWorld.accorderRecoursFixture.réponseSignée?.content ??
        new ReadableStream(),
    );
    expect(actualContent).to.be.equal(expectedContent);
  }

  if (this.eliminéWorld.recoursWorld.rejeterRecoursFixture.aÉtéCréé) {
    const result = await mediator.send<ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: Option.match(recours)
          .some(({ demande: { rejet } }) => rejet?.réponseSignée?.formatter() ?? '')
          .none(() => ''),
      },
    });

    const actualContent = await convertReadableStreamToString(result.content);
    const expectedContent = await convertReadableStreamToString(
      this.eliminéWorld.recoursWorld.rejeterRecoursFixture.réponseSignée?.content ??
        new ReadableStream(),
    );
    expect(actualContent).to.be.equal(expectedContent);
  }
}
