import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { assert, expect } from 'chai';
import waitForExpect from 'wait-for-expect';
import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../potentiel.world';
import { sleep } from '../../helpers/sleep';

export async function vérifierEmailEnvoyé(this: PotentielWorld, email: string, data: DataTable) {
  await waitForExpect(async () => {
    const exemple = data.rowsHash();
    const notification = this.notificationWorld.récupérerNotification(email, exemple.sujet);
    for (const [key, value] of Object.entries(exemple)) {
      if (key === 'sujet') {
        expect(notification.messageSubject).to.match(new RegExp(value));
        continue;
      }
      const variable = notification.variables[key];

      expect(variable).to.match(new RegExp(value));
    }
  });
}

export async function vérifierEmailNonEnvoyé(this: PotentielWorld, email: string) {
  await sleep(500);
<<<<<<< HEAD
  this.notificationWorld.vérifierAucunEmailsEnvoyés(email);
=======
  const exemple = data.rowsHash();
  const destinataires = this.notificationWorld
    .récupérerDestinataires(exemple.sujet)
    .map(({ recipients }) => recipients.map((r) => r.email))
    .flat();

  expect(destinataires).not.to.contain(
    Email.convertirEnValueType(email).email,
    'Un email non désiré a été envoyé',
  );
>>>>>>> da5504900 (✨ Notifier les administrateurs en cas de nouveau DGEC Validateur)
}

Alors(
  'un email a été envoyé au porteur avec :',
  async function (this: PotentielWorld, data: DataTable) {
    await vérifierEmailEnvoyé.call(this, this.utilisateurWorld.porteurFixture.email, data);
  },
);

Alors(`aucun email n'a été envoyé au porteur`, async function (this: PotentielWorld) {
  await vérifierEmailNonEnvoyé.call(this, this.utilisateurWorld.porteurFixture.email);
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
