import { faker } from '@faker-js/faker';

import { DocumentProjet, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';

import { AbstractFixture } from '../../../../fixture';
import { LauréatWorld } from '../../lauréat.world';

interface TransmettreDateAchèvement {
  readonly dateAchèvement: string;
  readonly transmiseLe: string;
  readonly transmisePar: string;
}

export class TransmettreDateAchèvementFixture
  extends AbstractFixture<TransmettreDateAchèvement>
  implements TransmettreDateAchèvement
{
  #dateAchèvement!: string;

  get dateAchèvement(): string {
    return this.#dateAchèvement;
  }

  #transmiseLe!: string;

  get transmiseLe(): string {
    return this.#transmiseLe;
  }

  #transmisePar!: string;

  get transmisePar(): string {
    return this.#transmisePar;
  }
  constructor(public readonly lauréatWorld: LauréatWorld) {
    super();
  }

  créer(partialFixture?: Partial<TransmettreDateAchèvement>): TransmettreDateAchèvement {
    const fixture: TransmettreDateAchèvement = {
      dateAchèvement: faker.date
        .between({
          from: new Date(
            new Date(this.lauréatWorld.notifierLauréatFixture.notifiéLe).getTime() + 1,
          ),
          to: new Date(),
        })
        .toISOString(),
      transmiseLe: faker.date.recent().toISOString(),
      transmisePar: faker.internet.email(),
      ...partialFixture,
    };

    this.#dateAchèvement = new Date(fixture.dateAchèvement).toISOString();
    this.#transmiseLe = new Date(fixture.transmiseLe).toISOString();
    this.#transmisePar = fixture.transmisePar;

    this.aÉtéCréé = true;

    return this;
  }

  mapToExpected(identifiantProjet: IdentifiantProjet.ValueType) {
    return {
      attestation: DocumentProjet.convertirEnValueType(
        identifiantProjet.formatter(),
        Lauréat.Achèvement.TypeDocumentAttestationConformité.attestationConformitéValueType.formatter(),
        DateTime.convertirEnValueType(this.transmiseLe).formatter(),
        'application/pdf',
      ),

      dateAchèvementRéel: DateTime.convertirEnValueType(this.dateAchèvement),
      preuveTransmissionAuCocontractant: Option.none,
      misÀJourLe: DateTime.convertirEnValueType(this.transmiseLe),
      misÀJourPar: Email.convertirEnValueType(this.transmisePar),
    };
  }
}
