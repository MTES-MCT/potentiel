import { faker } from '@faker-js/faker';

import { Lauréat } from '@potentiel-domain/projet';

import { PièceJustificative } from '#helpers';

import { AbstractFixture } from '../../../../../fixture.js';

export type CréerDemandeChangementReprésentantLégalFixture = Partial<
  Readonly<DemanderChangementReprésentantLégal>
>;

export interface DemanderChangementReprésentantLégal {
  readonly nomReprésentantLégal: string;
  readonly typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType;
  readonly pièceJustificative: PièceJustificative;
  readonly demandéLe: string;
  readonly demandéPar: string;
  readonly statut: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.ValueType;
}

export class DemanderChangementReprésentantLégalFixture
  extends AbstractFixture<DemanderChangementReprésentantLégal>
  implements DemanderChangementReprésentantLégal
{
  #nomReprésentantLégal!: string;

  get nomReprésentantLégal(): string {
    return this.#nomReprésentantLégal;
  }

  #typeReprésentantLégal!: Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType;

  get typeReprésentantLégal(): Lauréat.ReprésentantLégal.TypeReprésentantLégal.ValueType {
    return this.#typeReprésentantLégal;
  }

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

  #statut!: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.ValueType;

  get statut(): Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.ValueType {
    return this.#statut;
  }

  // demandes indexés par demandéLe
  #demandesPrécédentes = new Map<
    string,
    DemanderChangementReprésentantLégal & { content: string }
  >();
  #ajouterDemandePrécédente(demande: DemanderChangementReprésentantLégal & { content: string }) {
    this.#demandesPrécédentes.set(new Date(demande.demandéLe).toISOString(), demande);
  }
  getDemandePrécédente(demandéLe: string) {
    return this.#demandesPrécédentes.get(new Date(demandéLe).toISOString());
  }

  créer(
    partialFixture: CréerDemandeChangementReprésentantLégalFixture,
  ): Readonly<DemanderChangementReprésentantLégal> {
    const fixture = {
      statut: Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.demandé,
      nomReprésentantLégal: faker.person.fullName(),
      typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.personneMorale,
      demandéLe: faker.date.recent().toISOString(),
      demandéPar: faker.internet.email(),
      pièceJustificative: faker.potentiel.document(),
      ...partialFixture,
    };

    this.#pièceJustificative = fixture.pièceJustificative;

    this.#nomReprésentantLégal = fixture.nomReprésentantLégal;
    this.#typeReprésentantLégal = fixture.typeReprésentantLégal;
    this.#demandéLe = fixture.demandéLe;
    this.#demandéPar = fixture.demandéPar;
    this.#statut = fixture.statut;

    this.aÉtéCréé = true;

    this.#ajouterDemandePrécédente({ ...fixture, content: fixture.pièceJustificative.content });

    return fixture;
  }
}
