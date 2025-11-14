import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat, DocumentProjet } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { Role } from '@potentiel-domain/utilisateur';

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

    const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
      type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

    return Option.isSome(achèvement) && achèvement.estAchevé
      ? {
          date: new Date(achèvement.preuveTransmissionAuCocontractant.dateCréation).getTime(),
          attestation: achèvement.attestation.formatter(),
          preuveTransmissionAuCocontractant:
            achèvement.preuveTransmissionAuCocontractant.formatter(),
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
