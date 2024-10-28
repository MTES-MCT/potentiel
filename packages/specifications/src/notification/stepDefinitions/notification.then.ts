import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';

import { PotentielWorld } from '../../potentiel.world';

Alors('un email a été envoyé avec :', function (this: PotentielWorld, data: DataTable) {
  const exemple = data.rowsHash();

  // TODO: utiliser un mapper
  const email =
    exemple.destinataire === 'porteur'
      ? this.utilisateurWorld.porteurFixture.email
      : exemple.destinataire === 'dreal'
        ? this.utilisateurWorld.drealFixture.email
        : '';
  delete exemple.destinataire;

  const notif = this.notificationWorld.récupérerNotification(email, exemple.sujet);

  for (const [key, value] of Object.entries(exemple)) {
    if (key === 'sujet') {
      expect(notif.messageSubject).to.equal(value);
    } else {
      expect(notif.variables[key]).to.equal(value);
    }
  }
});
