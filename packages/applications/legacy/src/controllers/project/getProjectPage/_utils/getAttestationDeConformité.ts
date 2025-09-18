import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Role } from '@potentiel-domain/utilisateur';
import { DocumentProjet } from '@potentiel-domain/document';

export type GetAttestationDeConformitéForProjectPage = {
  date: number;
  attestation: DocumentProjet.RawType;
  preuveTransmissionAuCocontractant: DocumentProjet.RawType;
  identifiantProjet: IdentifiantProjet.RawType;
  permissionModifier: boolean;
};

export const getAttestationDeConformité = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  rôle: string,
): Promise<GetAttestationDeConformitéForProjectPage | undefined> => {
  try {
    const utilisateur = Role.convertirEnValueType(rôle);

    const attestationConformité =
      await mediator.send<Lauréat.Achèvement.AttestationConformité.ConsulterAttestationConformitéQuery>(
        {
          type: 'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
          data: { identifiantProjetValue: identifiantProjet.formatter() },
        },
      );

    return Option.isSome(attestationConformité)
      ? {
          date: new Date(
            attestationConformité.preuveTransmissionAuCocontractant.dateCréation,
          ).getTime(),
          attestation: attestationConformité.attestation.formatter(),
          preuveTransmissionAuCocontractant:
            attestationConformité.preuveTransmissionAuCocontractant.formatter(),
          identifiantProjet: identifiantProjet.formatter(),
          permissionModifier: utilisateur.aLaPermission(
            'achèvement.attestationConformité.modifier',
          ),
        }
      : undefined;
  } catch (error) {
    getLogger('Legacy|getProjectPage|getAttestationDeConformité').error(
      `Impossible de consulter l'attestation de conformité`,
      {
        identifiantProjet: identifiantProjet.formatter(),
      },
    );

    return undefined;
  }
};
