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
     * est décalée de 200ms après cette notification, et celle de la notification lauréat de 300ms,
     * pour garantir un historique cohérent (notification éliminé < recours accordé < notification lauréat).
     */
    const estMêmeJour = DateTime.convertirEnValueType(fixture.dateAccord).estMêmeJourQue(
      DateTime.convertirEnValueType(partialData.dateNotification),
    );

    const dateAccordFinale = estMêmeJour
      ? DateTime.convertirEnValueType(partialData.dateNotification)
          .ajouterNombreDeMillisecondes(200)
          .formatter()
      : fixture.dateAccord;

    const dateNotificationLauréat = estMêmeJour
      ? DateTime.convertirEnValueType(partialData.dateNotification)
          .ajouterNombreDeMillisecondes(300)
          .formatter()
      : fixture.dateAccord;

    this.#dateAccord = dateAccordFinale;
    this.#dateNotificationLauréat = dateNotificationLauréat;
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
