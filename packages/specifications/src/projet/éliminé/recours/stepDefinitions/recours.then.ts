import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { assert, expect } from 'chai';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Document } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';
import { convertReadableStreamToString } from '../../../../helpers/convertReadableToString';

Alors(
  /le recours du projet éliminé devrait être(.*)demandé/,
  async function (this: PotentielWorld, etat: string) {
    if (etat.includes('de nouveau')) {
      this.éliminéWorld.recoursWorld.reinitialiserEnDemande();
    }

    await waitForExpect(async () =>
      vérifierRecours.call(
        this,
        this.éliminéWorld.identifiantProjet,
        Éliminé.Recours.StatutRecours.demandé,
      ),
    );
  },
);

Alors(`le recours du projet éliminé devrait être annulé`, async function (this: PotentielWorld) {
  await waitForExpect(async () =>
    vérifierRecours.call(
      this,
      this.éliminéWorld.identifiantProjet,
      Éliminé.Recours.StatutRecours.annulé,
    ),
  );
});

Alors(`le recours du projet éliminé devrait être rejeté`, async function (this: PotentielWorld) {
  await waitForExpect(async () =>
    vérifierRecours.call(
      this,
      this.éliminéWorld.identifiantProjet,
      Éliminé.Recours.StatutRecours.rejeté,
    ),
  );
});

Alors(`le recours du projet éliminé devrait être accordé`, async function (this: PotentielWorld) {
  await waitForExpect(async () =>
    vérifierRecours.call(
      this,
      this.éliminéWorld.identifiantProjet,
      Éliminé.Recours.StatutRecours.accordé,
    ),
  );
});

Alors(
  `la demande de recours du projet éliminé devrait être en instruction`,
  async function (this: PotentielWorld) {
    await waitForExpect(async () =>
      vérifierRecours.call(
        this,
        this.éliminéWorld.identifiantProjet,
        Éliminé.Recours.StatutRecours.enInstruction,
      ),
    );
  },
);

async function vérifierRecours(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  statut: Éliminé.Recours.StatutRecours.ValueType,
) {
  const recours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
    type: 'Éliminé.Recours.Query.ConsulterRecours',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
    },
  });

  const actuelRecours = mapToPlainObject(recours);
  const expectedRecours = mapToPlainObject(
    this.éliminéWorld.recoursWorld.mapToRecoursExpected(identifiantProjet, statut),
  );

  actuelRecours.should.be.deep.equal(expectedRecours);

  const demandeRecours = await mediator.send<Éliminé.Recours.ConsulterDemandeRecoursQuery>({
    type: 'Éliminé.Recours.Query.ConsulterDemandeRecours',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
      dateDemandeValue: this.éliminéWorld.recoursWorld.demanderRecoursFixture.demandéLe,
    },
  });

  const actualDemandeRecours = mapToPlainObject(demandeRecours);
  const expectedDemandeRecours = mapToPlainObject(
    this.éliminéWorld.recoursWorld.mapToDemandeRecoursExpected(identifiantProjet, statut),
  );

  actualDemandeRecours.should.be.deep.equal(expectedDemandeRecours);

  const pièceJustificative = await mediator.send<Document.ConsulterDocumentProjetQuery>({
    type: 'Document.Query.ConsulterDocumentProjet',
    data: {
      documentKey: Option.match(demandeRecours)
        .some<string>(({ demande: { pièceJustificative: piéceJustificative } }) =>
          piéceJustificative.formatter(),
        )
        .none(() => ''),
    },
  });

  assert(Option.isSome(pièceJustificative), `Pièce justificative non trouvée !`);

  const actualPièceJustificativeContent = await convertReadableStreamToString(
    pièceJustificative.content,
  );
  const expectedPièceJustificativeContent = await convertReadableStreamToString(
    this.éliminéWorld.recoursWorld.demanderRecoursFixture.pièceJustificative.content,
  );

  expect(actualPièceJustificativeContent).to.be.equal(expectedPièceJustificativeContent);

  if (this.éliminéWorld.recoursWorld.accorderRecoursFixture.aÉtéCréé) {
    const result = await mediator.send<Document.ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: Option.match(demandeRecours)
          .some(({ demande: { accord } }) => accord?.réponseSignée?.formatter() ?? '')
          .none(() => ''),
      },
    });

    assert(Option.isSome(result), `Réponse signée non trouvée !`);

    const actualContent = await convertReadableStreamToString(result.content);
    const expectedContent = await convertReadableStreamToString(
      this.éliminéWorld.recoursWorld.accorderRecoursFixture.réponseSignée?.content ??
        new ReadableStream(),
    );
    expect(actualContent).to.be.equal(expectedContent);
  }

  if (this.éliminéWorld.recoursWorld.rejeterRecoursFixture.aÉtéCréé) {
    const result = await mediator.send<Document.ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: Option.match(demandeRecours)
          .some(({ demande: { rejet } }) => rejet?.réponseSignée?.formatter() ?? '')
          .none(() => ''),
      },
    });

    assert(Option.isSome(result), `Réponse signée non trouvée !`);

    const actualContent = await convertReadableStreamToString(result.content);
    const expectedContent = await convertReadableStreamToString(
      this.éliminéWorld.recoursWorld.rejeterRecoursFixture.réponseSignée?.content ??
        new ReadableStream(),
    );
    expect(actualContent).to.be.equal(expectedContent);
  }
}
