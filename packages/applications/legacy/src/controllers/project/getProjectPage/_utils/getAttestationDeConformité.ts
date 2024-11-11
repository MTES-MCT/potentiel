import { mediator } from 'mediateur';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Achèvement } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { AchèvementRéelDTO } from '../../../../modules/frise';
import { User } from '../../../../entities';

export const getAttestationDeConformité = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  user: User,
): Promise<AchèvementRéelDTO | undefined> => {
  const attestationConformité = await mediator.send<Achèvement.ConsulterAttestationConformitéQuery>(
    {
      type: 'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    },
  );

  return Option.isSome(attestationConformité)
    ? {
        type: 'achevement-reel',
        date: attestationConformité.dateTransmissionAuCocontractant.date.getTime(),
        attestation: attestationConformité.attestation.formatter(),
        preuveTransmissionAuCocontractant:
          attestationConformité.preuveTransmissionAuCocontractant.formatter(),
        identifiantProjet: identifiantProjet.formatter(),
        permissionModifier: ['admin', 'dreal', 'dgec-validateur'].includes(user.role),
      }
    : undefined;
};
