import { DocumentProjet } from '@potentiel-domain/document/';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { convertStringToReadableStream } from '../helpers/convertStringToReadable';
import { PotentielWorld } from '../potentiel.world';

export async function mockRécupererGarantiesFinancières(
  this: PotentielWorld,
  identifiantProjet: IdentifiantProjet.ValueType,
): ReturnType<Lauréat.GarantiesFinancières.RécupérerGarantiesFinancièresPort> {
  return {
    attestation: {
      content: convertStringToReadableStream(
        this.lauréatWorld.garantiesFinancièresWorld.actuelles.importer.attestation.content,
      ),
      key: DocumentProjet.bind({
        dateCréation:
          this.lauréatWorld.garantiesFinancièresWorld.actuelles.importer.dateConstitution,
        format: this.lauréatWorld.garantiesFinancièresWorld.actuelles.importer.attestation.format,
        identifiantProjet: identifiantProjet.formatter(),
        typeDocument:
          Lauréat.GarantiesFinancières.TypeDocumentGarantiesFinancières
            .attestationGarantiesFinancièresActuellesValueType.type,
      }),
    },
    garantiesFinancières: Lauréat.GarantiesFinancières.GarantiesFinancières.convertirEnValueType({
      type: this.lauréatWorld.garantiesFinancièresWorld.actuelles.importer.garantiesFinancièresType,
      attestation: {
        format: this.lauréatWorld.garantiesFinancièresWorld.actuelles.importer.attestation.format,
      },
      dateConstitution:
        this.lauréatWorld.garantiesFinancièresWorld.actuelles.importer.dateConstitution,
      dateÉchéance: this.lauréatWorld.garantiesFinancièresWorld.actuelles.importer.dateÉchéance,
    }),
  };
}
