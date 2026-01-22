import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { convertStringToReadableStream } from '../helpers/convertStringToReadable.js';
import { PotentielWorld } from '../potentiel.world.js';

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
