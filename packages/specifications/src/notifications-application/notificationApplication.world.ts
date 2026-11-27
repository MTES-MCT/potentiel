import { DateTime, Email } from '@potentiel-domain/common';
import type { NotificationApplication } from '@potentiel-domain/notifications-application';

import type { PotentielWorld } from '../potentiel.world.js';

type Domaine = NotificationApplication.NotificationApplicationEntity['domaine'];

type MapToExpectedProps = {
  identifiantUtilisateur: string;
  exemple: Record<string, string>;
};

export class NotificationApplicationWorld {
  constructor(public readonly potentielWorld: PotentielWorld) {}

  mapToExpected({
    identifiantUtilisateur,
    exemple,
  }: MapToExpectedProps): NotificationApplication.ListerNotificationsApplicationItemReadModel {
    return {
      identifiantUtilisateur: Email.convertirEnValueType(identifiantUtilisateur),
      identifiantProjet: this.potentielWorld.lauréatWorld.identifiantProjet,
      domaine: exemple.domaine as Domaine,
      dateChangement: DateTime.convertirEnValueType(new Date(exemple['date changement'])),
    };
  }
}
