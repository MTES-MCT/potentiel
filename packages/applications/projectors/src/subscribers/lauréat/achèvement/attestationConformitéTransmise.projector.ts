import { Achèvement } from '@potentiel-domain/laureat';

import { upsertProjection } from '../../../infrastructure';

import { getProjectData } from './utils/getProjectData';

export const attestationConformitéTransmiseProjector = async ({
  payload,
}: Achèvement.AttestationConformitéTransmiseEvent) => {
  const projet = await getProjectData(payload.identifiantProjet);

  await upsertProjection<Achèvement.AchèvementEntity>(`achevement|${payload.identifiantProjet}`, {
    ...projet,
    identifiantProjet: payload.identifiantProjet,
    attestationConformité: { format: payload.attestation.format, date: payload.date },
    preuveTransmissionAuCocontractant: {
      format: payload.preuveTransmissionAuCocontractant.format,
      date: payload.dateTransmissionAuCocontractant,
    },
    dernièreMiseÀJour: { date: payload.date, utilisateur: payload.utilisateur },
  });
};
