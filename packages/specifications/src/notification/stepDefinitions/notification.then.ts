import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import waitForExpect from 'wait-for-expect';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Email } from '@potentiel-domain/common';

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

export async function vérifierEmailNonEnvoyé(this: PotentielWorld, email: string, data: DataTable) {
  await sleep(500);
  const exemple = data.rowsHash();
  const destinataires = this.notificationWorld
    .récupérerDestinataires(exemple.sujet)
    .map(({ recipients }) => recipients.map((r) => r.email))
    .flat();

  expect(destinataires).not.to.contain(
    Email.convertirEnValueType(email).email,
    'Un email non désiré à été envoyé',
  );
}

Alors(
  'un email a été envoyé au porteur avec :',
  async function (this: PotentielWorld, data: DataTable) {
    await vérifierEmailEnvoyé.call(this, this.utilisateurWorld.porteurFixture.email, data);
  },
);

Alors(
  `un email n'a pas été envoyé au porteur avec :`,
  async function (this: PotentielWorld, data: DataTable) {
    await vérifierEmailNonEnvoyé.call(this, this.utilisateurWorld.porteurFixture.email, data);
  },
);

Alors(
  `un email n'a pas été envoyé à l'utilisateur avec :`,
  async function (this: PotentielWorld, data: DataTable) {
    const email = this.utilisateurWorld.inviterUtilisateur.email;
    await vérifierEmailNonEnvoyé.call(this, email, data);
  },
);

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
  'un email a été envoyé à la cre avec :',
  async function (this: PotentielWorld, data: DataTable) {
    await vérifierEmailEnvoyé.call(this, this.utilisateurWorld.creFixture.email, data);
  },
);
