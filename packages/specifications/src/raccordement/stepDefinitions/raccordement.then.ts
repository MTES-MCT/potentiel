import { Then as Alors } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import waitForExpect from 'wait-for-expect';
import { assert, expect } from 'chai';

import { Raccordement, GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';

import { PotentielWorld } from '../../potentiel.world';
import { convertReadableStreamToString } from '../../helpers/convertReadableToString';

Alors(
  `le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    await waitForExpect(async () => {
      const actual = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(actual)) {
        throw new Error('Raccordement inconnu');
      }

      actual.dossiers
        .map((d) => d.référence.formatter())
        .should.contain(this.raccordementWorld.référenceDossier);
    });
  },
);

Alors(
  `la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;
    await waitForExpect(async () => {
      const raccordement = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      const dossierRaccordement =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            référenceDossierRaccordementValue: référenceDossier,
          },
        });

      vérifierRaccordement.call(this, identifiantProjet, raccordement);
      vérifierDossierRaccordement.call(this, identifiantProjet, dossierRaccordement);

      assert(Option.isSome(dossierRaccordement), 'dossierRaccordement is undefined');
      assert(
        dossierRaccordement.demandeComplèteRaccordement,
        'demandeComplèteRaccordement is undefined',
      );
      const actualAccuséRéception = dossierRaccordement.demandeComplèteRaccordement.accuséRéception;
      const { accuséRéception: expectedAccuséRéception } = this.raccordementWorld
        .modifierDemandeComplèteRaccordementFixture.aÉtéCréé
        ? this.raccordementWorld.modifierDemandeComplèteRaccordementFixture
        : this.raccordementWorld.transmettreDemandeComplèteRaccordementFixture;

      assert(actualAccuséRéception, 'actualAccuséRéception is not defined');
      const result = await mediator.send<ConsulterDocumentProjetQuery>({
        type: 'Document.Query.ConsulterDocumentProjet',
        data: {
          documentKey: actualAccuséRéception.formatter(),
        },
      });

      const actualContent = await convertReadableStreamToString(result.content);
      const expectedContent = await convertReadableStreamToString(expectedAccuséRéception.content);
      actualContent.should.be.equal(expectedContent);
    });
  },
);

Alors(
  `le projet devrait avoir un raccordement attribué au gestionnaire de réseau {string}`,
  async function (this: PotentielWorld, raisonSociale: string) {
    const { identifiantProjet } = this.lauréatWorld;
    const { codeEIC } =
      this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(raisonSociale);

    await vérifierGestionnaireAttribué.call(
      this,
      identifiantProjet,
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC),
    );
  },
);

Alors(
  `le projet devrait avoir un raccordement attribué au gestionnaire de réseau`,
  async function (this: PotentielWorld) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet;

    const { commune, codePostal } = this.candidatureWorld.importerCandidature.values.localitéValue;
    const codeEIC =
      this.gestionnaireRéseauWorld.rechercherOREParVille({ commune, codePostal })?.codeEIC ?? '';

    await vérifierGestionnaireAttribué.call(
      this,
      identifiantProjet,
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(codeEIC),
    );
  },
);

Alors(
  `le projet devrait avoir un raccordement attribué au gestionnaire de réseau inconnu`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;

    await vérifierGestionnaireAttribué.call(
      this,
      identifiantProjet,
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu,
    );
  },
);

Alors(
  'le projet lauréat devrait avoir {int} dossiers de raccordement',
  async function (this: PotentielWorld, nombreDeDemandes: number) {
    const { identifiantProjet } = this.lauréatWorld;

    await waitForExpect(async () => {
      const actual = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(actual)) {
        throw new Error('Raccordement inconnu');
      }

      actual.dossiers.should.length(nombreDeDemandes);
    });
  },
);

Alors(
  `la date de mise en service {string} devrait être consultable dans le dossier de raccordement du projet lauréat ayant pour référence {string}`,
  async function (
    this: PotentielWorld,
    dateMiseEnService: string,
    référenceDossierRaccordement: string,
  ) {
    const { identifiantProjet } = this.lauréatWorld;
    await waitForExpect(async () => {
      const actual = await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
        data: {
          référenceDossierRaccordementValue: référenceDossierRaccordement,
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(actual)) {
        throw new Error('Dossier de raccordement non trouvé');
      }

      if (Option.isNone(actual.miseEnService)) {
        throw new Error('Date mise en service non trouvé');
      }

      expect(
        actual.miseEnService?.dateMiseEnService?.estÉgaleÀ(
          DateTime.convertirEnValueType(new Date(dateMiseEnService).toISOString()),
        ),
      ).to.be.true;
    });
  },
);

Alors(
  `la proposition technique et financière signée devrait être consultable dans le dossier de raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.raccordementWorld;
    await waitForExpect(async () => {
      const dossierRaccordement =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            référenceDossierRaccordementValue: référenceDossier,
          },
        });

      vérifierDossierRaccordement.call(this, identifiantProjet, dossierRaccordement);
      assert(Option.isSome(dossierRaccordement));

      const { propositionTechniqueEtFinancière } = dossierRaccordement;

      assert(propositionTechniqueEtFinancière, 'propositionTechniqueEtFinancière is undefined');

      const { propositionTechniqueEtFinancièreSignée } = this.raccordementWorld
        .modifierPropositionTechniqueEtFinancièreFixture.aÉtéCréé
        ? this.raccordementWorld.modifierPropositionTechniqueEtFinancièreFixture
        : this.raccordementWorld.transmettrePropositionTechniqueEtFinancièreFixture;

      const result = await mediator.send<ConsulterDocumentProjetQuery>({
        type: 'Document.Query.ConsulterDocumentProjet',
        data: {
          documentKey:
            propositionTechniqueEtFinancière.propositionTechniqueEtFinancièreSignée.formatter(),
        },
      });

      const actualContent = await convertReadableStreamToString(result.content);
      const expectedContent = await convertReadableStreamToString(
        propositionTechniqueEtFinancièreSignée.content,
      );

      actualContent.should.be.equal(expectedContent);
    });
  },
);

Alors(
  `le dossier ayant pour référence {string} ne devrait plus être consultable dans la liste des dossiers du raccordement pour le projet`,
  async function (this: PotentielWorld, référenceDossier: string) {
    const { identifiantProjet } = this.lauréatWorld;
    await waitForExpect(async () => {
      const raccordementDuProjet = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      if (Option.isNone(raccordementDuProjet)) {
        throw new Error('Raccordement inconnu');
      }

      const dossierCible = raccordementDuProjet.dossiers.find(
        (d) => d.référence.formatter() === référenceDossier,
      );

      expect(dossierCible).to.be.undefined;

      const dossierRaccordement =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            référenceDossierRaccordementValue: référenceDossier,
          },
        });

      expect(Option.isNone(dossierRaccordement)).to.be.true;
    });
  },
);

Alors(
  `le dossier de raccordement ne devrait plus être consultable dans le raccordement du projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } =
      this.raccordementWorld.transmettreDemandeComplèteRaccordementFixture;
    await waitForExpect(async () => {
      const raccordement = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

      expect(Option.isNone(raccordement)).to.be.true;

      const dossierRaccordement =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet.formatter(),
            référenceDossierRaccordementValue: référenceDossier,
          },
        });

      expect(Option.isNone(dossierRaccordement)).to.be.true;
    });
  },
);

async function vérifierGestionnaireAttribué(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType,
) {
  await waitForExpect(async () => {
    // Assert on read model
    const résultat = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
      },
    });

    assert(Option.isSome(résultat));

    expect(résultat.identifiantGestionnaireRéseau?.codeEIC).to.eq(
      identifiantGestionnaireRéseau?.codeEIC,
      'raccordement invalide',
    );

    for (const { référence } of résultat.dossiers) {
      const dossier = await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet.formatter(),
          référenceDossierRaccordementValue: référence.formatter(),
        },
      });
      assert(Option.isSome(dossier));
      expect(dossier.identifiantGestionnaireRéseau.codeEIC).to.eq(
        identifiantGestionnaireRéseau.codeEIC,
        'dossier invalide',
      );
    }
  });
}

function vérifierRaccordement(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  raccordement: Option.Type<Raccordement.ConsulterRaccordementReadModel>,
) {
  const { raccordement: expectedRaccordement } = mapToPlainObject(
    this.raccordementWorld.mapToExpected(identifiantProjet),
  );
  const actualRaccordement = mapToPlainObject(raccordement);

  // HACK : misÀJourLe vaut la date de l'event (created_at),
  //  on ne peut pas calculer cette date de manière exacte dans les tests
  if (Option.isSome(actualRaccordement)) {
    for (const doss of actualRaccordement.dossiers) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (doss as any).misÀJourLe;
    }
  }

  actualRaccordement.should.be.deep.equal(
    expectedRaccordement,
    `le raccordement n'est pas identique`,
  );
}

function vérifierDossierRaccordement(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
  dossierRaccordement: Option.Type<Raccordement.ConsulterDossierRaccordementReadModel>,
): asserts dossierRaccordement is Raccordement.ConsulterDossierRaccordementReadModel {
  const { dossier: expectedDossier } = mapToPlainObject(
    this.raccordementWorld.mapToExpected(identifiantProjet),
  );
  const actualDossierRaccordement = mapToPlainObject(dossierRaccordement);

  if (Option.isSome(actualDossierRaccordement)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (actualDossierRaccordement as any).misÀJourLe;
  }
  actualDossierRaccordement.should.be.deep.equal(
    expectedDossier,
    `le dossier de raccordement n'est pas identique`,
  );
}
