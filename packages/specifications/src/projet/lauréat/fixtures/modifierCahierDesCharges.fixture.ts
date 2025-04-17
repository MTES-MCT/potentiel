import { faker } from '@faker-js/faker';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { AbstractFixture } from '../../../fixture';

export interface ModifierCahierDesCharges {
  readonly cahierDesCharges: string;
  readonly modifiéLe: string;
  readonly modifiéPar: string;
}

const nomCdcToRéférence: Record<string, AppelOffre.CahierDesChargesRéférence> = {
  initial: 'initial',
  'modifié paru le 30/08/2022': '30/08/2022',
};

export class ModifierCahierDesChargesFixture
  extends AbstractFixture<ModifierCahierDesCharges>
  implements ModifierCahierDesCharges
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
    partialFixture: Partial<Readonly<ModifierCahierDesCharges>> & { modifiéPar: string },
  ): Readonly<ModifierCahierDesCharges> {
    let cahierDesCharges = '30/08/2022';
    if (partialFixture.cahierDesCharges) {
      cahierDesCharges = nomCdcToRéférence[partialFixture.cahierDesCharges];
      if (!cahierDesCharges) {
        throw new Error(
          `Cahier des charges inconnu dans la fixture: ${partialFixture.cahierDesCharges}`,
        );
      }
    }

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
