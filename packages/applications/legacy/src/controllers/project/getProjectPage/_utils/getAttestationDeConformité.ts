import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Achèvement } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { AchèvementRéelDTO } from '../../../../modules/frise';
import { User } from '../../../../entities';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Role } from '@potentiel-domain/utilisateur';

export const getAttestationDeConformité = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  rôle: string,
): Promise<AchèvementRéelDTO | undefined> => {
  try {
    const utilisateur = Role.convertirEnValueType(rôle);

    const attestationConformité =
      await mediator.send<Achèvement.ConsulterAttestationConformitéQuery>({
        type: 'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
        data: { identifiantProjetValue: identifiantProjet.formatter() },
      });

    return Option.isSome(attestationConformité)
      ? {
          type: 'achevement-reel',
          date: attestationConformité.dateTransmissionAuCocontractant.date.getTime(),
          attestation: attestationConformité.attestation.formatter(),
          preuveTransmissionAuCocontractant:
            attestationConformité.preuveTransmissionAuCocontractant.formatter(),
          identifiantProjet: identifiantProjet.formatter(),
          permissionModifier: utilisateur.aLaPermission('achèvement.modifier'),
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
