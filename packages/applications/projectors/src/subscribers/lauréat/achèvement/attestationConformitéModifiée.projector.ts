import { Achèvement } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projections';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { upsertProjection } from '../../../infrastructure';

export const attestationConformitéModifiéeProjector = async ({
  payload,
}: Achèvement.AttestationConformitéModifiéeEvent) => {
  const achèvement = await findProjection<Achèvement.AchèvementEntity>(
    `achevement|${payload.identifiantProjet}`,
  );

  if (Option.isNone(achèvement)) {
    getLogger().error(`Achèvement non trouvé`, { identifiantProjet: payload.identifiantProjet });
    return;
  }

  await upsertProjection<Achèvement.AchèvementEntity>(`achevement|${payload.identifiantProjet}`, {
    ...achèvement,
    identifiantProjet: payload.identifiantProjet,
    attestationConformité: { format: payload.attestation.format, date: payload.date },
    preuveTransmissionAuCocontractant: {
      format: payload.preuveTransmissionAuCocontractant.format,
      date: payload.dateTransmissionAuCocontractant,
    },
    dernièreMiseÀJour: { date: payload.date, utilisateur: payload.utilisateur },
  });
};
