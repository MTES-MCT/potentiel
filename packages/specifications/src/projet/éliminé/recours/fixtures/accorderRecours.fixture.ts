import { faker } from '@faker-js/faker';

import { DateTime, Email } from '@potentiel-domain/common';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../fixture.js';

interface AccorderRecours {
  readonly réponseSignée: PièceJustificative;
  readonly dateAccord: string;
  readonly accordéLe: string;
  readonly accordéPar: string;
}

export class AccorderRecoursFixture
  extends AbstractFixture<AccorderRecours>
  implements AccorderRecours
{
  #réponseSignée!: PièceJustificative;

  get réponseSignée(): PièceJustificative {
    return this.#réponseSignée;
  }

  #dateAccord!: string;

  get dateAccord(): string {
    return this.#dateAccord;
  }

  #accordéLe!: string;

  get accordéLe(): string {
    return this.#accordéLe;
  }

  #accordéPar!: string;

  get accordéPar(): string {
    return this.#accordéPar;
  }

  #dateNotificationLauréat!: string;

  get dateNotificationLauréat(): string {
    return this.#dateNotificationLauréat;
  }

  créer(
    partialData: Partial<AccorderRecours> & {
      dateNotification: string;
    },
  ): Readonly<AccorderRecours> {
    const fixture: AccorderRecours = {
      accordéLe: faker.date.soon().toISOString(),
      accordéPar: faker.internet.email(),
      réponseSignée: faker.potentiel.document(),
      dateAccord: faker.date
        .between({
          from: new Date(partialData.dateNotification),
          to: new Date(),
        })
        .toISOString(),
      ...partialData,
    };

    /**
     * Reproduit l'ajustement fait par RecoursAggregate.accorder : si la date de réponse signée
     * tombe le même jour que la notification d'élimination, la date de l'évènement RecoursAccordé
     * est décalée de 100ms après cette notification, et celle de la notification lauréat de 200ms,
     * pour garantir un historique cohérent (notification éliminé < recours accordé < notification lauréat).
     */
    const notifiéLe = DateTime.convertirEnValueType(partialData.dateNotification);
    const dateAccord = DateTime.convertirEnValueType(fixture.dateAccord);
    const estMêmeJour = dateAccord.estMêmeJourQue(notifiéLe);
    const dateAccordFinale = estMêmeJour
      ? notifiéLe.ajouterNombreDeMillisecondes(100)
      : dateAccord;
    const dateNotificationLauréat = estMêmeJour
      ? notifiéLe.ajouterNombreDeMillisecondes(200)
      : dateAccord;

    this.#dateAccord = dateAccordFinale.formatter();
    this.#dateNotificationLauréat = dateNotificationLauréat.formatter();
    this.#accordéLe = fixture.accordéLe;
    this.#accordéPar = fixture.accordéPar;
    this.#réponseSignée = fixture.réponseSignée;

    this.aÉtéCréé = true;
    return { ...fixture, dateAccord: this.#dateAccord };
  }
  mapToExpectedLauréat() {
    if (!this.aÉtéCréé) {
      return {};
    }
    return {
      notifiéLe: DateTime.convertirEnValueType(this.dateNotificationLauréat),
      notifiéPar: Email.convertirEnValueType(this.accordéPar),
    };
  }
}
