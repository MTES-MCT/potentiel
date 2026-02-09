import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, Document } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from '../../../../potentiel.world.js';
import { convertReadableStreamToString } from '../../../../helpers/convertReadableToString.js';

Alors(
  "l'actionnaire du projet lauréat devrait être consultable",
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        this.candidatureWorld.importerCandidature.identifiantProjet,
      );
      const actionnaire = await mediator.send<Lauréat.Actionnaire.ActionnaireQuery>({
        type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const actual = mapToPlainObject(actionnaire);
      const expected = mapToPlainObject(
        this.lauréatWorld.actionnaireWorld.mapToExpected(
          identifiantProjet,
          this.candidatureWorld.importerCandidature.values.sociétéMèreValue,
        ),
      );

      actual.should.be.deep.equal(expected);
    });
  },
);

Alors(
  "la demande de changement de l'actionnaire devrait être consultable",
  async function (this: PotentielWorld) {
    await vérifierChangementActionnaire.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Lauréat.Actionnaire.StatutChangementActionnaire.demandé,
    );
  },
);

Alors(
  "le changement enregistré de l'actionnaire devrait être consultable",
  async function (this: PotentielWorld) {
    await vérifierChangementActionnaire.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Lauréat.Actionnaire.StatutChangementActionnaire.informationEnregistrée,
    );
  },
);

Alors(
  "la demande de changement de l'actionnaire devrait être annulée",
  async function (this: PotentielWorld) {
    await vérifierChangementActionnaire.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Lauréat.Actionnaire.StatutChangementActionnaire.annulé,
    );
  },
);

Alors(
  "la demande de changement de l'actionnaire devrait être accordée",
  async function (this: PotentielWorld) {
    await vérifierChangementActionnaire.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Lauréat.Actionnaire.StatutChangementActionnaire.accordé,
    );
  },
);

Alors(
  "la demande de changement d'actionnaire devrait être rejetée",
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      await vérifierChangementActionnaire.call(
        this,
        this.candidatureWorld.importerCandidature.identifiantProjet,
        Lauréat.Actionnaire.StatutChangementActionnaire.rejeté,
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

      const actual = await mediator.send<Lauréat.Actionnaire.ConsulterActionnaireQuery>({
        type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      expect(Option.isSome(actual) && actual.dateDernièreDemande).to.be.undefined;
    });
  },
);

Alors(
  "l'actionnaire du projet lauréat devrait être mis à jour",
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const { identifiantProjet } = this.lauréatWorld;

      const actionnaire = await mediator.send<Lauréat.Actionnaire.ActionnaireQuery>({
        type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const actual = mapToPlainObject(actionnaire);
      const expected = mapToPlainObject(
        this.lauréatWorld.actionnaireWorld.mapToExpected(
          identifiantProjet,
          this.candidatureWorld.importerCandidature.values.sociétéMèreValue,
        ),
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

      const actionnaire = await mediator.send<Lauréat.Actionnaire.ActionnaireQuery>({
        type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      const actual = mapToPlainObject(actionnaire);
      const expected = mapToPlainObject(
        this.lauréatWorld.actionnaireWorld.mapToExpected(
          identifiantProjet,
          this.candidatureWorld.importerCandidature.values.sociétéMèreValue,
        ),
      );

      console.log(actual);
      console.log(expected);

      actual.should.be.deep.equal(expected);
    });
  },
);

async function vérifierChangementActionnaire(
  this: PotentielWorld,
  identifiantProjet: string,
  statut: Lauréat.Actionnaire.StatutChangementActionnaire.ValueType,
) {
  const demandeEnCours =
    await mediator.send<Lauréat.Actionnaire.ConsulterChangementActionnaireQuery>({
      type: 'Lauréat.Actionnaire.Query.ConsulterChangementActionnaire',
      data: {
        identifiantProjet,
        demandéLe: this.lauréatWorld.actionnaireWorld.enregistrerChangementActionnaireFixture
          .aÉtéCréé
          ? this.lauréatWorld.actionnaireWorld.enregistrerChangementActionnaireFixture.demandéLe
          : this.lauréatWorld.actionnaireWorld.demanderChangementActionnaireFixture.demandéLe,
      },
    });

  const actual = mapToPlainObject(demandeEnCours);

  const expected = mapToPlainObject(
    this.lauréatWorld.actionnaireWorld.mapDemandeToExpected(
      IdentifiantProjet.convertirEnValueType(identifiantProjet),
      statut,
    ),
  );

  actual.should.be.deep.equal(expected);

  const actionnaire = await mediator.send<Lauréat.Actionnaire.ConsulterActionnaireQuery>({
    type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
    data: {
      identifiantProjet,
    },
  });

  if (statut.estDemandé()) {
    expect(Option.isSome(actionnaire) && actionnaire.aUneDemandeEnCours).to.be.true;
  } else {
    expect(Option.isSome(actionnaire) && actionnaire.aUneDemandeEnCours).to.be.false;
  }

  if (this.lauréatWorld.actionnaireWorld.accorderChangementActionnaireFixture.aÉtéCréé) {
    const result = await mediator.send<Document.ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: Option.match(demandeEnCours)
          .some(({ demande: { accord } }) => accord?.réponseSignée?.formatter() ?? '')
          .none(() => ''),
      },
    });

    assert(Option.isSome(result), `Réponse signée non trouvée !`);

    const actualContent = await convertReadableStreamToString(result.content);
    const expectedContent = await convertReadableStreamToString(
      this.lauréatWorld.actionnaireWorld.accorderChangementActionnaireFixture.réponseSignée
        ?.content ?? new ReadableStream(),
    );
    expect(actualContent).to.be.equal(expectedContent);
  }

  if (this.lauréatWorld.actionnaireWorld.rejeterChangementActionnaireFixture.aÉtéCréé) {
    const result = await mediator.send<Document.ConsulterDocumentProjetQuery>({
      type: 'Document.Query.ConsulterDocumentProjet',
      data: {
        documentKey: Option.match(demandeEnCours)
          .some(({ demande: { rejet } }) => rejet?.réponseSignée?.formatter() ?? '')
          .none(() => ''),
      },
    });

    assert(Option.isSome(result), `Réponse signée non trouvée !`);

    const actualContent = await convertReadableStreamToString(result.content);
    const expectedContent = await convertReadableStreamToString(
      this.lauréatWorld.actionnaireWorld.rejeterChangementActionnaireFixture.réponseSignée
        ?.content ?? new ReadableStream(),
    );
    expect(actualContent).to.be.equal(expectedContent);
  }
}
