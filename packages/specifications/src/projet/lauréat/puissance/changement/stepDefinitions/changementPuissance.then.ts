import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { assert, expect } from 'chai';

import { mapToPlainObject } from '@potentiel-domain/core';
import { Puissance } from '@potentiel-domain/laureat';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { PotentielWorld } from '../../../../../potentiel.world';
import { convertReadableStreamToString } from '../../../../../helpers/convertReadableToString';

Alors(
  'la demande de changement de puissance devrait être consultable',
  async function (this: PotentielWorld) {
    await vérifierChangementPuissance.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Puissance.StatutChangementPuissance.demandé,
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

      const actual = await mediator.send<Puissance.ConsulterPuissanceQuery>({
        type: 'Lauréat.Puissance.Query.ConsulterPuissance',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

      expect(Option.isSome(actual) && actual.dateDemandeEnCours).to.be.undefined;
    });
  },
);

Alors(
  `la demande de changement de la puissance devrait être accordée`,
  async function (this: PotentielWorld) {
    await vérifierChangementPuissance.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Puissance.StatutChangementPuissance.accordé,
    );
  },
);

Alors(
  `la demande de changement de la puissance devrait être rejetée`,
  async function (this: PotentielWorld) {
    await vérifierChangementPuissance.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Puissance.StatutChangementPuissance.rejeté,
    );
  },
);

Alors(
  'le changement enregistré de puissance devrait être consultable',
  async function (this: PotentielWorld) {
    await vérifierChangementPuissance.call(
      this,
      this.candidatureWorld.importerCandidature.identifiantProjet,
      Puissance.StatutChangementPuissance.informationEnregistrée,
    );
  },
);

async function vérifierChangementPuissance(
  this: PotentielWorld,
  identifiantProjet: string,
  statut: Puissance.StatutChangementPuissance.ValueType,
) {
  return waitForExpect(async () => {
    const demandeEnCours = await mediator.send<Puissance.ConsulterChangementPuissanceQuery>({
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
    });

    assert(Option.isSome(demandeEnCours), 'Demande de changement de puissance non trouvée !');

    const actual = mapToPlainObject(demandeEnCours);

    const expected = mapToPlainObject(
      this.lauréatWorld.puissanceWorld.changementPuissanceWorld.mapToExpected({
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
        puissanceActuelle: this.lauréatWorld.puissanceWorld.importerPuissanceFixture.puissance,
        statut,
      }),
    );

    actual.should.be.deep.equal(expected);

    const puissance = await mediator.send<Puissance.ConsulterPuissanceQuery>({
      type: 'Lauréat.Puissance.Query.ConsulterPuissance',
      data: {
        identifiantProjet,
      },
    });

    assert(Option.isSome(puissance), 'Puissance non trouvée !');

    if (statut.estDemandé()) {
      expect(Option.isSome(puissance) && puissance.dateDemandeEnCours).to.be.not.undefined;
    }

    if (
      this.lauréatWorld.puissanceWorld.changementPuissanceWorld.accorderChangementPuissanceFixture
        .aÉtéCréé
    ) {
      expect(demandeEnCours.demande.accord).to.be.not.undefined;

      const result = await mediator.send<ConsulterDocumentProjetQuery>({
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

      const result = await mediator.send<ConsulterDocumentProjetQuery>({
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
