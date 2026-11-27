import { Then as Alors, type DataTable } from '@cucumber/cucumber';
import { expect } from 'chai';
import { mediator } from 'mediateur';

import { mapToPlainObject } from '@potentiel-domain/core';
import type { NotificationApplication } from '@potentiel-domain/notifications-application';

import { waitForExpect } from '#helpers';
import type { PotentielWorld } from '../../potentiel.world.js';

Alors(
  `une notification application a été ajoutée pour la dreal avec :`,
  async function (this: PotentielWorld, dataTable: DataTable) {
    const identifiantUtilisateur = this.utilisateurWorld.drealFixture.email;

    const expected = mapToPlainObject(
      this.notificationApplicationWorld.mapToExpected({
        identifiantUtilisateur,
        exemple: dataTable.rowsHash(),
      }),
    );

    await waitForExpect(async () => {
      const { items } =
        await mediator.send<NotificationApplication.ListerNotificationsApplicationQuery>({
          type: 'NotificationApplication.Query.ListerNotificationsApplication',
          data: { identifiantUtilisateur },
        });

      expect(items.length).to.be.equal(1);
      expect(mapToPlainObject(items)).to.deep.include(expected);
    });
  },
);

Alors(
  `aucune notification application n'a été ajoutée pour la dreal`,
  async function (this: PotentielWorld) {
    const identifiantUtilisateur = this.utilisateurWorld.drealFixture.email;

    await waitForExpect(async () => {
      const { items } =
        await mediator.send<NotificationApplication.ListerNotificationsApplicationQuery>({
          type: 'NotificationApplication.Query.ListerNotificationsApplication',
          data: { identifiantUtilisateur },
        });

      expect(items.length).to.be.equal(0);
    });
  },
);
