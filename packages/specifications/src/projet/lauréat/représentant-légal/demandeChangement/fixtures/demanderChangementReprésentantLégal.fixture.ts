import { faker } from '@faker-js/faker';
import { match } from 'ts-pattern';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { AbstractFixture } from '../../../../../fixture';
import { convertStringToReadableStream } from '../../../../../helpers/convertStringToReadable';

type PièceJustificative = { format: string; content: ReadableStream };

export type CréerDemandeChangementReprésentantLégalFixture = Partial<
  Readonly<DemanderChangementReprésentantLégal>
> & {
  identifiantProjet: string;
};

export interface DemanderChangementReprésentantLégal {
  readonly nomReprésentantLégal: string;
  readonly typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.ValueType;
  readonly piècesJustificative: Array<PièceJustificative>;
  readonly demandéLe: string;
  readonly demandéPar: string;
}

export class DemanderChangementReprésentantLégalFixture
  extends AbstractFixture<DemanderChangementReprésentantLégal>
  implements DemanderChangementReprésentantLégal
{
  #identifiantProjet!: string;

  get identifiantProjet(): string {
    return this.#identifiantProjet;
  }

  #nomReprésentantLégal!: string;

  get nomReprésentantLégal(): string {
    return this.#nomReprésentantLégal;
  }

  #typeReprésentantLégal!: ReprésentantLégal.TypeReprésentantLégal.ValueType;

  get typeReprésentantLégal(): ReprésentantLégal.TypeReprésentantLégal.ValueType {
    return this.#typeReprésentantLégal;
  }

  #piècesJustificative!: Array<PièceJustificative>;

  get piècesJustificative(): Array<PièceJustificative> {
    return this.#piècesJustificative;
  }

  #demandéLe!: string;

  get demandéLe(): string {
    return this.#demandéLe;
  }

  #demandéPar!: string;

  get demandéPar(): string {
    return this.#demandéPar;
  }

  #statut!: ReprésentantLégal.StatutDemandeChangementReprésentantLégal.ValueType;

  get statut(): ReprésentantLégal.StatutDemandeChangementReprésentantLégal.ValueType {
    return this.#statut;
  }

  créer(
    partialFixture: CréerDemandeChangementReprésentantLégalFixture,
  ): Readonly<DemanderChangementReprésentantLégal> {
    const format = 'application/pdf';
    const fixture = {
      nomReprésentantLégal: faker.person.fullName(),
      typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.personnePhysique,
      statut: ReprésentantLégal.StatutDemandeChangementReprésentantLégal.demandé,
      demandéLe: faker.date.recent().toISOString(),
      demandéPar: faker.internet.email(),
      piècesJustificative: [],
      ...partialFixture,
    };

    fixture.piècesJustificative = match(fixture.typeReprésentantLégal.type)
      .returnType<DemanderChangementReprésentantLégal['piècesJustificative']>()
      .with('personne-physique', () => [
        {
          format,
          content: convertStringToReadableStream(
            `une copie de titre d'identité (carte d'identité ou passeport) en cours de validité`,
          ),
        },
      ])
      .with('personne-morale', () => [
        {
          format,
          content: convertStringToReadableStream(`un extrait Kbis`),
        },
        {
          format,
          content: convertStringToReadableStream(
            `une copie des statuts de la société OU une attestation de récépissé de dépôt de fonds pour constitution de capital social`,
          ),
        },
        {
          format,
          content: convertStringToReadableStream(
            `une copie de l’acte désignant le représentant légal de la société`,
          ),
        },
      ])
      .with('collectivité', () => [
        {
          format,
          content: convertStringToReadableStream(
            `un extrait de délibération portant sur le projet objet de l'offre`,
          ),
        },
      ])
      .with('autre', () => [
        {
          format,
          content: convertStringToReadableStream(
            `tout document officiel permettant d'attester de l'existence juridique de la personne`,
          ),
        },
      ])
      .otherwise(() => []);

    this.#identifiantProjet = fixture.identifiantProjet;
    this.#nomReprésentantLégal = fixture.nomReprésentantLégal;
    this.#typeReprésentantLégal = fixture.typeReprésentantLégal;
    this.#piècesJustificative = fixture.piècesJustificative;
    this.#demandéLe = fixture.demandéLe;
    this.#demandéPar = fixture.demandéPar;
    this.#statut = fixture.statut;

    this.aÉtéCréé = true;

    return fixture;
  }
}
