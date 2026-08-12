import { faker } from '@faker-js/faker';

import { DateTime } from '@potentiel-domain/common';

import type { PièceJustificative } from '#helpers';
import { AbstractFixture } from '../../../../fixture.js';

interface DemanderRecours {
  readonly pièceJustificative: PièceJustificative;
  readonly demandéLe: string;
  readonly demandéPar: string;
  readonly raison: string;
}

export class DemanderRecoursFixture
  extends AbstractFixture<DemanderRecours>
  implements DemanderRecours
{
  #pièceJustificative!: PièceJustificative;

  get pièceJustificative(): PièceJustificative {
    return this.#pièceJustificative;
  }

  #demandéLe!: string;

  get demandéLe(): string {
    return this.#demandéLe;
  }

  #demandéPar!: string;

  get demandéPar(): string {
    return this.#demandéPar;
  }

  #raison!: string;

  get raison(): string {
    return this.#raison;
  }

  créer(
    partialData?: Partial<DemanderRecours> & {
      dateNotification?: string;
    },
  ): Readonly<DemanderRecours> {
    const fixture = {
      demandéLe: faker.date.recent().toISOString(),
      demandéPar: faker.internet.email(),
      raison: faker.word.words(),
      pièceJustificative: faker.potentiel.document(),
      ...partialData,
    };

    /**
     * Reproduit l'ajustement fait par RecoursAggregate.demander : si la date de demande
     * tombe le même jour que la notification d'élimination, la date de l'évènement
     * RecoursDemandé est décalée de 100ms après cette notification, pour garantir un
     * historique cohérent (notification éliminé < demande de recours).
     */
    const demandéLe = partialData?.dateNotification
      ? DateTime.convertirEnValueType(fixture.demandéLe).estMêmeJourQue(
          DateTime.convertirEnValueType(partialData.dateNotification),
        )
        ? DateTime.convertirEnValueType(partialData.dateNotification)
            .ajouterNombreDeMillisecondes(100)
            .formatter()
        : fixture.demandéLe
      : fixture.demandéLe;

    this.#demandéLe = demandéLe;
    this.#demandéPar = fixture.demandéPar;
    this.#raison = fixture.raison;
    this.#pièceJustificative = fixture.pièceJustificative;

    this.aÉtéCréé = true;
    return { ...fixture, demandéLe };
  }
}
