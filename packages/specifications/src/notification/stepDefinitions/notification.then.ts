import { Then as Alors, DataTable } from '@cucumber/cucumber';
import { assert, expect } from 'chai';

import { PotentielWorld } from '../../potentiel.world';

Alors(
  'un email a été envoyé à {string} avec :',
  function (this: PotentielWorld, email: string, data: DataTable) {
    const example = data.rowsHash();
    const notif = this.notificationWorld.notifications.find(
      (notif) =>
        notif.recipients.find((r) => r.email === email) &&
        (!example.sujet || notif.messageSubject === example.sujet),
    );
    assert(notif, 'Pas de notification');

    for (const [key, value] of Object.entries(example)) {
      if (key === 'sujet') {
        expect(notif.messageSubject).to.equal(value);
      } else {
        expect(notif.variables[key]).to.equal(value);
      }
    }
  },
);
