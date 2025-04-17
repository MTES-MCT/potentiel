import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import waitForExpect from 'wait-for-expect';
import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { PotentielWorld } from '../../potentiel.world';

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

Alors(
  'un email a été envoyé au porteur avec :',
  async function (this: PotentielWorld, data: DataTable) {
    await vérifierEmailEnvoyé.call(this, this.utilisateurWorld.porteurFixture.email, data);
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
    const identifiantAppelOffre = this.lauréatWorld.identifiantProjet.appelOffre;

    const ao = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',

      data: {
        identifiantAppelOffre,
      },
    });

    if (Option.isNone(ao)) {
      throw new Error("L'appel d'offre n'existe pas");
    }

    await vérifierEmailEnvoyé.call(this, ao.dossierSuiviPar, data);
  },
);
