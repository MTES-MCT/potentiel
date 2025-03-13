import { Achèvement } from '@potentiel-domain/laureat';

import { updateOneProjection } from '../../../infrastructure';

export const attestationConformitéModifiéeProjector = async ({
  payload,
}: Achèvement.AttestationConformitéModifiéeEvent) => {
  await updateOneProjection<Achèvement.AchèvementEntity>(
    `achevement|${payload.identifiantProjet}`,
    {
      identifiantProjet: payload.identifiantProjet,
      attestationConformité: { format: payload.attestation.format, date: payload.date },
      preuveTransmissionAuCocontractant: {
        format: payload.preuveTransmissionAuCocontractant.format,
        date: payload.dateTransmissionAuCocontractant,
      },
      dernièreMiseÀJour: { date: payload.date, utilisateur: payload.utilisateur },
    },
  );
};
