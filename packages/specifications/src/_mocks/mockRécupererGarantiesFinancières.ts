import type { DateTime } from '@potentiel-domain/common';
import type { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { convertStringToReadableStream } from '../helpers/convertStringToReadableStream.js';
import type { PotentielWorld } from '../potentiel.world.js';

export async function mockRécupererGarantiesFinancières(
  this: PotentielWorld,
  _: IdentifiantProjet.ValueType,
): ReturnType<Lauréat.GarantiesFinancières.RécupererConstitutionGarantiesFinancièresPort> {
  if (!this.lauréatWorld.garantiesFinancièresWorld.actuelles.importer.aÉtéCréé) {
    return;
  }
  return {
    attestation: {
      content: convertStringToReadableStream(
        this.lauréatWorld.garantiesFinancièresWorld.actuelles.importer.attestation.content,
      ),
      format: this.lauréatWorld.garantiesFinancièresWorld.actuelles.importer.attestation.format,
    },
    dateConstitution: this.lauréatWorld.garantiesFinancièresWorld.actuelles.importer
      .dateConstitution as DateTime.RawType,
  };
}
