import { IdentifiantProjet, Candidature } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const candidatureImportéeProjector = async ({
  payload,
}: Candidature.CandidatureImportéeEvent) => {
  const candidatureToUpsert = mapToCandidatureToUpsert(payload);

  await upsertProjection<Candidature.CandidatureEntity>(
    `candidature|${payload.identifiantProjet}`,
    candidatureToUpsert,
  );
};

export const mapToCandidatureToUpsert = (
  payload: Candidature.CandidatureImportéeEvent['payload'],
): Omit<Candidature.CandidatureEntity, 'type'> => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

  return {
    identifiantProjet: payload.identifiantProjet,
    appelOffre: identifiantProjet.appelOffre,
    période: identifiantProjet.période,
    ...Candidature.Dépôt.convertirEnValueType(payload).formatter(),
    ...Candidature.Instruction.convertirEnValueType(payload).formatter(),
    estNotifiée: false,
    notification: undefined,
    misÀJourLe: payload.importéLe,
    détailsMisÀJourLe: payload.importéLe,
  };
};
