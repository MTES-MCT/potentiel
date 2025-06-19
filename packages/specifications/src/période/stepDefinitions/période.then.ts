import { Then as Alors } from '@cucumber/cucumber';
import waitForExpect from 'wait-for-expect';
import { assert, expect } from 'chai';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Période } from '@potentiel-domain/periode';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { Accès, Lauréat, Éliminé } from '@potentiel-domain/projet';
import { Candidature } from '@potentiel-domain/projet';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

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

    for (const {
      identifiantProjet,
      typeGarantiesFinancières,
      puissanceProductionAnnuelle,
      evaluationCarboneSimplifiée,
      nomCandidat,
      fournisseurs,
    } of candidats.items) {
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

      if (typeGarantiesFinancières) {
        const garantiesFinancières =
          await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
            type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
            data: {
              identifiantProjetValue: identifiantProjet.formatter(),
            },
          });

        assert(
          Option.isSome(garantiesFinancières),
          `Aucune garanties financières pour ${identifiantProjet.formatter()}`,
        );
        expect(garantiesFinancières.garantiesFinancières.type.estÉgaleÀ(typeGarantiesFinancières))
          .to.be.true;
      }

      if (puissanceProductionAnnuelle) {
        const puissance = await mediator.send<Lauréat.Puissance.ConsulterPuissanceQuery>({
          type: 'Lauréat.Puissance.Query.ConsulterPuissance',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });
        assert(Option.isSome(puissance), `Aucune puissance pour ${identifiantProjet.formatter()}`);
        expect(puissance.puissance).to.equal(puissanceProductionAnnuelle);
      }

      if (nomCandidat) {
        const producteur = await mediator.send<Lauréat.Producteur.ConsulterProducteurQuery>({
          type: 'Lauréat.Producteur.Query.ConsulterProducteur',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });
        assert(Option.isSome(producteur), `Aucun producteur pour ${identifiantProjet.formatter()}`);
        expect(producteur.producteur).to.equal(nomCandidat);
      }

      if (evaluationCarboneSimplifiée || fournisseurs) {
        const fournisseur = await mediator.send<Lauréat.Fournisseur.ConsulterFournisseurQuery>({
          type: 'Lauréat.Fournisseur.Query.ConsulterFournisseur',
          data: {
            identifiantProjet: identifiantProjet.formatter(),
          },
        });
        assert(
          Option.isSome(fournisseur),
          `Aucun fournisseur pour ${identifiantProjet.formatter()}`,
        );

        expect(fournisseur.évaluationCarboneSimplifiée).to.equal(evaluationCarboneSimplifiée);
        expect(fournisseur.fournisseurs.length).to.eq(
          fournisseurs.length,
          'Le nombre de fournisseurs est différent',
        );
        for (const [index, value] of fournisseur.fournisseurs.entries()) {
          expect(value.estÉgaleÀ(fournisseurs[index])).to.be.true;
        }
      }
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
