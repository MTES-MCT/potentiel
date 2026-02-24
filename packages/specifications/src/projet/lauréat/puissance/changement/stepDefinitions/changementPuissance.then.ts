import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { assert, expect } from 'chai';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Document } from '@potentiel-domain/projet';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from '../../../../../potentiel.world.js';
import { convertReadableStreamToString } from '../../../../../helpers/convertReadableToString.js';

Alors(
  'la demande de changement de puissance devrait être consultable',
  async function (this: PotentielWorld) {
    await vérifierChangementPuissance.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Lauréat.Puissance.StatutChangementPuissance.demandé,
    );
  },
);

Alors(
  'la demande de changement de puissance ne devrait plus être consultable',
  async function (this: PotentielWorld) {
    return waitForExpect(async () => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        this.candidatureWorld.importerCandidature.identifiantProjet,
      );

      const actual = await mediator.send<Lauréat.Puissance.ConsulterPuissanceQuery>({
        type: 'Lauréat.Puissance.Query.ConsulterPuissance',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      expect(Option.isSome(actual) && actual.aUneDemandeEnCours).to.be.false;
    });
  },
);

Alors(
  `la demande de changement de la puissance devrait être annulée`,
  async function (this: PotentielWorld) {
    await vérifierChangementPuissance.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Lauréat.Puissance.StatutChangementPuissance.annulé,
    );
  },
);

Alors(
  `la demande de changement de la puissance devrait être accordée`,
  async function (this: PotentielWorld) {
    await vérifierChangementPuissance.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Lauréat.Puissance.StatutChangementPuissance.accordé,
    );
  },
);

Alors(
  `la demande de changement de la puissance devrait être rejetée`,
  async function (this: PotentielWorld) {
    await vérifierChangementPuissance.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Lauréat.Puissance.StatutChangementPuissance.rejeté,
    );
  },
);

Alors(
  'le changement enregistré de puissance devrait être consultable',
  async function (this: PotentielWorld) {
    await vérifierChangementPuissance.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Lauréat.Puissance.StatutChangementPuissance.informationEnregistrée,
    );
  },
);

async function vérifierChangementPuissance(
  this: PotentielWorld,
  identifiantProjet: string,
  statut: Lauréat.Puissance.StatutChangementPuissance.ValueType,
) {
  return waitForExpect(async () => {
    const demandeEnCours = await mediator.send<Lauréat.Puissance.ConsulterChangementPuissanceQuery>(
      {
        type: 'Lauréat.Puissance.Query.ConsulterChangementPuissance',
        data: {
          identifiantProjet,
          demandéLe: this.lauréatWorld.puissanceWorld.changementPuissanceWorld
            .demanderChangementPuissanceFixture.aÉtéCréé
            ? this.lauréatWorld.puissanceWorld.changementPuissanceWorld
                .demanderChangementPuissanceFixture.demandéLe
            : this.lauréatWorld.puissanceWorld.changementPuissanceWorld
                .enregistrerChangementPuissanceFixture.demandéLe,
        },
      },
    );

    assert(Option.isSome(demandeEnCours), 'Demande de changement de puissance non trouvée !');

    const actual = mapToPlainObject(demandeEnCours);

    const expected = mapToPlainObject(
      this.lauréatWorld.puissanceWorld.changementPuissanceWorld.mapToExpected({
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        puissanceActuelle: this.candidatureWorld.importerCandidature.values.puissanceValue,
        statut,
      }),
    );

    actual.should.be.deep.equal(expected);

    const puissance = await mediator.send<Lauréat.Puissance.ConsulterPuissanceQuery>({
      type: 'Lauréat.Puissance.Query.ConsulterPuissance',
      data: {
        identifiantProjet,
      },
    });

    assert(Option.isSome(puissance), 'Puissance non trouvée !');

    if (statut.estDemandé()) {
      expect(Option.isSome(puissance) && puissance.aUneDemandeEnCours).to.be.true;
      expect(Option.isSome(puissance) && puissance.dateDernièreDemande).to.be.not.undefined;
    } else {
      expect(Option.isSome(puissance) && puissance.aUneDemandeEnCours).to.be.false;
      expect(Option.isSome(puissance) && puissance.dateDernièreDemande).to.be.undefined;
    }

    if (
      this.lauréatWorld.puissanceWorld.changementPuissanceWorld.accorderChangementPuissanceFixture
        .aÉtéCréé
    ) {
      expect(demandeEnCours.demande.accord).to.be.not.undefined;

      const result = await mediator.send<Document.ConsulterDocumentProjetQuery>({
        type: 'Document.Query.ConsulterDocumentProjet',
        data: {
          documentKey: demandeEnCours.demande.accord?.réponseSignée
            ? demandeEnCours.demande.accord.réponseSignée.formatter()
            : '',
        },
      });

      assert(Option.isSome(result), `Réponse signée non trouvée !`);

      const actualContent = await convertReadableStreamToString(result.content);
      const expectedContent = await convertReadableStreamToString(
        this.lauréatWorld.puissanceWorld.changementPuissanceWorld.accorderChangementPuissanceFixture
          .réponseSignée?.content ?? new ReadableStream(),
      );
      expect(actualContent).to.be.equal(expectedContent);
    }

    if (
      this.lauréatWorld.puissanceWorld.changementPuissanceWorld.rejeterChangementPuissanceFixture
        .aÉtéCréé
    ) {
      expect(demandeEnCours.demande.rejet).to.be.not.undefined;

      const result = await mediator.send<Document.ConsulterDocumentProjetQuery>({
        type: 'Document.Query.ConsulterDocumentProjet',
        data: {
          documentKey: demandeEnCours.demande.rejet
            ? demandeEnCours.demande.rejet.réponseSignée.formatter()
            : '',
        },
      });

      assert(Option.isSome(result), `Réponse signée non trouvée !`);

      const actualContent = await convertReadableStreamToString(result.content);
      const expectedContent = await convertReadableStreamToString(
        this.lauréatWorld.puissanceWorld.changementPuissanceWorld.rejeterChangementPuissanceFixture
          .réponseSignée?.content ?? new ReadableStream(),
      );
      expect(actualContent).to.be.equal(expectedContent);
    }
  });
}
