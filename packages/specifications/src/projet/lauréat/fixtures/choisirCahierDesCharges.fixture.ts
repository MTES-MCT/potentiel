import { faker } from '@faker-js/faker';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { AbstractFixture } from '../../../fixture.js';

export interface ChoisirCahierDesCharges {
  readonly cahierDesCharges: string;
  readonly modifiéLe: string;
  readonly modifiéPar: string;
}

const nomCdcToRéférence: Record<string, AppelOffre.RéférenceCahierDesCharges.RawType> = {
  initial: 'initial',
  'modifié paru le 30/08/2022': '30/08/2022',
};

export class ChoisirCahierDesChargesFixture
  extends AbstractFixture<ChoisirCahierDesCharges>
  implements ChoisirCahierDesCharges
{
  #cahierDesCharges!: string;

  get cahierDesCharges(): string {
    return this.#cahierDesCharges;
  }

  #modifiéLe!: string;

  get modifiéLe(): string {
    return this.#modifiéLe;
  }

  #modifiéPar!: string;

  get modifiéPar(): string {
    return this.#modifiéPar;
  }

  créer(
    partialFixture: Partial<Readonly<ChoisirCahierDesCharges>> & { modifiéPar: string },
  ): Readonly<ChoisirCahierDesCharges> {
    const cahierDesCharges = partialFixture.cahierDesCharges
      ? (nomCdcToRéférence[partialFixture.cahierDesCharges] ?? partialFixture.cahierDesCharges)
      : '30/08/2022';

    const fixture = {
      modifiéLe: faker.date.recent().toISOString(),
      ...partialFixture,
      cahierDesCharges,
    };

    this.#cahierDesCharges = fixture.cahierDesCharges;
    this.#modifiéLe = fixture.modifiéLe;
    this.#modifiéPar = fixture.modifiéPar;

    this.aÉtéCréé = true;

    return fixture;
  }
}
