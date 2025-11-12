import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { faker } from '@faker-js/faker';

import { DateTime } from '@potentiel-domain/common';
import { Accès } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../potentiel.world';
import { RéclamerProjetFixture } from '../fixtures/réclamer/réclamerProjet.fixture';

Quand(
  `un porteur réclame le projet {lauréat-éliminé} avec le même email que celui de la candidature`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    const { emailContactValue: emailCandidature } =
      this.candidatureWorld.importerCandidature.values;
    const porteur = this.utilisateurWorld.porteurFixture.créer({
      email: emailCandidature,
    });

    await réclamerProjet.call(this, {
      identifiantProjet: identifiantProjet.formatter(),
      email: porteur.email,
    });
  },
);

Quand(
  `un porteur réclame le projet {lauréat-éliminé} en connaissant le prix et le numéro CRE`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    const { dépôtValue } = this.candidatureWorld.importerCandidature;

    const porteur = this.utilisateurWorld.porteurFixture.créer();

    await réclamerProjet.call(this, {
      identifiantProjet: identifiantProjet.formatter(),
      email: porteur.email,
      prixRéférence: dépôtValue.prixReference,
      numéroCRE: identifiantProjet.numéroCRE,
    });
  },
);

Quand(
  `un porteur réclame le projet {lauréat-éliminé} sans connaître le prix et le numéro CRE`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    const porteur = this.utilisateurWorld.porteurFixture.créer({});
    await réclamerProjet.call(this, {
      identifiantProjet: identifiantProjet.formatter(),
      email: porteur.email,
      prixRéférence: faker.number.float(),
      numéroCRE: faker.string.alphanumeric(),
    });
  },
);

Quand(
  `un porteur réclame le projet {lauréat-éliminé} avec un email différent de celui de la candidature`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    const porteur = this.utilisateurWorld.porteurFixture.créer({});

    await réclamerProjet.call(this, {
      identifiantProjet: identifiantProjet.formatter(),
      email: porteur.email,
    });
  },
);

Quand(`un porteur réclame la candidature lauréate`, async function (this: PotentielWorld) {
  const {
    identifiantProjet,
    values: { emailContactValue },
  } = this.candidatureWorld.importerCandidature;

  const porteur = this.utilisateurWorld.porteurFixture.créer({ email: emailContactValue });

  await réclamerProjet.call(this, {
    identifiantProjet,
    email: porteur.email,
  });
});

Quand(
  "un administrateur retire l'accès de l'utilisateur au projet {lauréat-éliminé}",
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

    await retirerAccèsProjet.call(this, {
      identifiantProjet: identifiantProjet.formatter(),
      identifiantUtilisateur: this.utilisateurWorld.porteurFixture.email,
    });
  },
);

Quand('un porteur retire ses accès au projet lauréat', async function (this: PotentielWorld) {
  await retirerAccèsProjet.call(this, {
    identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
    identifiantUtilisateur: this.utilisateurWorld.porteurFixture.email,
    retiréPar: this.utilisateurWorld.porteurFixture.email,
  });
});

Quand(
  'un administrateur remplace le porteur sur le projet lauréat avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    const { email } = this.accèsWorld.remplacerAccèsProjet.créer({
      email: exemple['nouveau'],
    });
    const identifiantUtilisateurValue =
      exemple['actuel'] ?? this.candidatureWorld.importerCandidature.dépôtValue.emailContact;

    try {
      await mediator.send<Accès.RemplacerAccèsProjetUseCase>({
        type: 'Projet.Accès.UseCase.RemplacerAccèsProjet',
        data: {
          identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
          identifiantUtilisateurValue,
          nouvelIdentifiantUtilisateurValue: email,
          remplacéLeValue: new Date().toISOString(),
          remplacéParValue: this.utilisateurWorld.adminFixture.email,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

export async function retirerAccèsProjet(
  this: PotentielWorld,
  {
    identifiantProjet,
    identifiantUtilisateur,
    retiréPar,
  }: { identifiantProjet: string; identifiantUtilisateur: string; retiréPar?: string },
) {
  try {
    await mediator.send<Accès.RetirerAccèsProjetUseCase>({
      type: 'Projet.Accès.UseCase.RetirerAccèsProjet',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: identifiantUtilisateur,
        retiréLeValue: DateTime.now().formatter(),
        retiréParValue: retiréPar ?? this.utilisateurWorld.adminFixture.email,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}

async function réclamerProjet(
  this: PotentielWorld,
  fixtureProps: Parameters<typeof RéclamerProjetFixture.prototype.créer>[0],
) {
  const {
    identifiantProjet,
    email,
    numéroCRE,
    prixRéférence: prix,
  } = this.accèsWorld.réclamerProjet.créer(fixtureProps);

  try {
    const avecPrixEtNuméroCRE = numéroCRE !== undefined && prix !== undefined;

    await mediator.send<Accès.RéclamerAccèsProjetUseCase>({
      type: 'Projet.Accès.UseCase.RéclamerAccèsProjet',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: email,
        dateRéclamationValue: DateTime.now().formatter(),
        ...(avecPrixEtNuméroCRE
          ? { type: 'avec-prix-numéro-cre', numéroCRE, prix }
          : { type: 'même-email-candidature' }),
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}
