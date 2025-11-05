import { Then as Alors } from '@cucumber/cucumber';
import waitForExpect from 'wait-for-expect';
import { assert, expect } from 'chai';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Période } from '@potentiel-domain/periode';
import { Accès, IdentifiantProjet, Lauréat, Éliminé } from '@potentiel-domain/projet';
import { Candidature } from '@potentiel-domain/projet';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { Routes } from '@potentiel-applications/routes';

import { PotentielWorld } from '../../potentiel.world';
import { convertReadableStreamToString } from '../../helpers/convertReadableToString';

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

Alors(
  'les attestations de désignation des candidatures de la période notifiée devraient être consultables',
  async function (this: PotentielWorld) {
    const { identifiantPériode } = this.périodeWorld;
    const candidatures = await mediator.send<Candidature.ListerCandidaturesQuery>({
      type: 'Candidature.Query.ListerCandidatures',
      data: {
        appelOffre: identifiantPériode.appelOffre,
        période: identifiantPériode.période,
      },
    });

    for (const candidature of candidatures.items) {
      expect(candidature.attestation, "La candidature n'a pas d'attestation").not.to.be.undefined;
      await waitForExpect(async () => {
        if (candidature.attestation) {
          const result = await mediator.send<ConsulterDocumentProjetQuery>({
            type: 'Document.Query.ConsulterDocumentProjet',
            data: {
              documentKey: candidature.attestation.formatter(),
            },
          });

          assert(Option.isSome(result), `Attestation non trouvée !`);

          expect(await convertReadableStreamToString(result.content)).to.have.length.gt(1);
          result.format.should.be.equal('application/pdf');
        }
      });
    }
  },
);

Alors(
  'les candidatures de la période notifiée devraient être notifiées',
  async function (this: PotentielWorld) {
    const { identifiantPériode } = this.périodeWorld;
    const candidatures = await mediator.send<Candidature.ListerCandidaturesQuery>({
      type: 'Candidature.Query.ListerCandidatures',
      data: {
        appelOffre: identifiantPériode.appelOffre,
        période: identifiantPériode.période,
      },
    });
    for (const candidature of candidatures.items) {
      expect(candidature.estNotifiée, "La candidature n'est pas notifiée").to.be.true;
    }
  },
);

Alors(`les porteurs doivent avoir accès à leur projet`, async function (this: PotentielWorld) {
  const { identifiantPériode } = this.périodeWorld;
  const candidatures = await mediator.send<Candidature.ListerCandidaturesQuery>({
    type: 'Candidature.Query.ListerCandidatures',
    data: {
      appelOffre: identifiantPériode.appelOffre,
      période: identifiantPériode.période,
    },
  });
  await waitForExpect(async () => {
    for (const candidature of candidatures.items) {
      await mediator.send<Accès.VérifierAccèsProjetQuery>({
        type: 'System.Projet.Accès.Query.VérifierAccèsProjet',
        data: {
          identifiantProjetValue: candidature.identifiantProjet.formatter(),
          identifiantUtilisateurValue: candidature.emailContact.formatter(),
        },
      });
    }
  });
});

Alors(
  'les porteurs ont été prévenu que leurs candidatures ont été notifiées',
  async function (this: PotentielWorld) {
    const candidats = this.périodeWorld.notifierPériodeFixture.lauréats.concat(
      this.périodeWorld.notifierPériodeFixture.éliminés,
    );

    const candidatAvecMultipleProjets = candidats.find(
      (candidat, _, self) =>
        self.filter((projet) => projet.emailContact === candidat.emailContact).length > 1,
    );
    assert(
      !!candidatAvecMultipleProjets,
      'Le jeu de donnée devrait avoir au moins un candidat avec plusieurs projets',
    );

    await waitForExpect(async () => {
      const emailsCandidats = new Set(candidats.map((projet) => projet.emailContact));
      for (const email of emailsCandidats) {
        const notif = this.notificationWorld.récupérerNotification(
          email,
          "Résultats de la .* période de l'appel d'offres .*",
        );

        const projets = candidats.filter((projet) => projet.emailContact === email);
        if (projets.length === 1) {
          const identifiantProjet = IdentifiantProjet.bind(projets[0]);
          expect(notif.variables.redirect_url).to.equal(
            `https://potentiel.beta.gouv.fr${Routes.Projet.details(identifiantProjet.formatter())}`,
          );
        } else {
          expect(notif.variables.redirect_url).to.equal(`https://potentiel.beta.gouv.fr`);
        }
      }
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
  try {
    const période = await mediator.send<Période.ConsulterPériodeQuery>({
      type: 'Période.Query.ConsulterPériode',
      data: {
        identifiantPériodeValue: identifiantPériode.formatter(),
      },
    });

    période.should.not.be.equal(
      Option.none,
      `La période ${identifiantPériode.période} notifiée pour l'appel d'offres ${identifiantPériode.appelOffre}`,
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
  } catch (error) {
    this.error = error as Error;
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
    `La période ${identifiantPériode.période} notifiée pour l'appel d'offres ${identifiantPériode.appelOffre}`,
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
