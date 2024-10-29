import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';

import { PotentielWorld } from '../../potentiel.world';

function vérifierEmailEnvoyé(this: PotentielWorld, email: string, data: DataTable) {
  const exemple = data.rowsHash();
  const notif = this.notificationWorld.récupérerNotification(email, exemple.sujet);

  for (const [key, value] of Object.entries(exemple)) {
    if (key === 'sujet') {
      expect(notif.messageSubject).to.equal(value);
    } else {
      expect(notif.variables[key]).to.equal(value);
    }
  }
}

Alors('un email a été envoyé au porteur avec :', function (this: PotentielWorld, data: DataTable) {
  vérifierEmailEnvoyé.call(this, this.utilisateurWorld.porteurFixture.email, data);
});

Alors('un email a été envoyé à la dreal avec :', function (this: PotentielWorld, data: DataTable) {
  vérifierEmailEnvoyé.call(this, this.utilisateurWorld.drealFixture.email, data);
});
