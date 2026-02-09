import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { assert } from 'chai';
import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Lauréat } from '@potentiel-domain/projet';

import { waitForExpect } from '#helpers';

import { PotentielWorld } from '../../potentiel.world.js';
import { sleep } from '../../helpers/sleep.js';

export async function vérifierEmailEnvoyé(this: PotentielWorld, email: string, data: DataTable) {
  await waitForExpect(async () => {
    const exemple = data.rowsHash();
    const { sujet, ...variables } = exemple;
    this.notificationWorld.vérifierNotification(email, sujet, variables);
  });
}

export async function vérifierEmailNonEnvoyé(this: PotentielWorld, email: string) {
  await sleep(500);
  this.notificationWorld.vérifierAucunEmailsEnvoyés(email);
}

Alors(
  'un email a été envoyé au porteur avec :',
  async function (this: PotentielWorld, data: DataTable) {
    await vérifierEmailEnvoyé.call(
      this,
      this.utilisateurWorld.porteurFixture.aÉtéCréé
        ? this.utilisateurWorld.porteurFixture.email
        : this.candidatureWorld.importerCandidature.values.emailContactValue,
      data,
    );
  },
);

Alors(`aucun email n'a été envoyé au porteur`, async function (this: PotentielWorld) {
  await vérifierEmailNonEnvoyé.call(
    this,
    this.utilisateurWorld.porteurFixture.aÉtéCréé
      ? this.utilisateurWorld.porteurFixture.email
      : this.candidatureWorld.importerCandidature.values.emailContactValue,
  );
});

Alors(`aucun email n'a été envoyé à l'utilisateur`, async function (this: PotentielWorld) {
  const email = this.utilisateurWorld.inviterUtilisateur.email;
  await vérifierEmailNonEnvoyé.call(this, email);
});

Alors(
  'un email a été envoyé à la dreal avec :',
  async function (this: PotentielWorld, data: DataTable) {
    await vérifierEmailEnvoyé.call(this, this.utilisateurWorld.drealFixture.email, data);
  },
);

Alors(
  'un email a été envoyé à la dgec avec :',
  async function (this: PotentielWorld, data: DataTable) {
    const { appelOffre: identifiantAppelOffre } = this.éliminéWorld.notifierEliminéFixture.aÉtéCréé
      ? this.éliminéWorld.identifiantProjet
      : this.lauréatWorld.identifiantProjet;

    const ao = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',

      data: {
        identifiantAppelOffre,
      },
    });

    if (Option.isNone(ao)) {
      throw new Error("L'appel d'offres n'existe pas");
    }

    await vérifierEmailEnvoyé.call(this, ao.dossierSuiviPar, data);
  },
);

Alors(
  `un email a été envoyé à l'autorité instructrice avec :`,
  async function (this: PotentielWorld, data: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;

    const cdc = await mediator.send<Lauréat.ConsulterCahierDesChargesQuery>({
      type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesCharges',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
      },
    });

    if (Option.isNone(cdc)) {
      throw new Error('Projet non trouvé');
    }

    const domaine = this.lauréatWorld.délaiWorld.demanderDélaiFixture.aÉtéCréé
      ? 'délai'
      : this.lauréatWorld.abandonWorld.demanderAbandonFixture.aÉtéCréé
        ? 'abandon'
        : '';

    assert(domaine, "Domaine inconnu, l'autorité instructrice ne peut être déterminée");

    const autorité = cdc.getAutoritéCompétente(domaine);
    const email = match(autorité)
      .with('dgec', () => cdc.appelOffre.dossierSuiviPar)
      .with('dreal', () => this.utilisateurWorld.drealFixture.email)
      .exhaustive();

    await vérifierEmailEnvoyé.call(this, email, data);
  },
);

Alors(
  'un email a été envoyé à la cre avec :',
  async function (this: PotentielWorld, data: DataTable) {
    await vérifierEmailEnvoyé.call(this, this.utilisateurWorld.creFixture.email, data);
  },
);

Alors(/^aucun .*email n'a été envoyé$/, async function (this: PotentielWorld) {
  await sleep(200);
  this.notificationWorld.vérifierToutesNotificationsPointées();
});

Alors(
  `un email a été envoyé à l'administrateur avec :`,
  async function (this: PotentielWorld, data: DataTable) {
    await vérifierEmailEnvoyé.call(this, this.utilisateurWorld.adminFixture.email, data);
  },
);

Alors(
  'un email a été envoyé au cocontractant avec :',
  async function (this: PotentielWorld, data: DataTable) {
    await vérifierEmailEnvoyé.call(this, this.utilisateurWorld.cocontractantFixture.email, data);
  },
);
