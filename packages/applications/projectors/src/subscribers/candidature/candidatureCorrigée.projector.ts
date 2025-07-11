import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export const candidatureCorrigéeProjector = async ({
  payload,
}: Candidature.CandidatureCorrigéeEvent) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

  const candidature = await findProjection<Candidature.CandidatureEntity>(
    `candidature|${identifiantProjet.formatter()}`,
  );

  const candidatureToUpsert = mapToCandidatureToUpsert({ payload, candidature, identifiantProjet });

  await upsertProjection<Candidature.CandidatureEntity>(
    `candidature|${payload.identifiantProjet}`,
    candidatureToUpsert,
  );
};

export const mapToCandidatureToUpsert = ({
  payload,
  candidature,
  identifiantProjet,
}: {
  payload: Candidature.CandidatureCorrigéeEvent['payload'];
  candidature: Option.Type<Candidature.CandidatureEntity>;
  identifiantProjet: IdentifiantProjet.ValueType;
}) => {
  const notification: Candidature.CandidatureEntity['notification'] = Option.isSome(candidature)
    ? payload.doitRégénérerAttestation && candidature.notification
      ? {
          ...candidature.notification,
          attestation: candidature.notification.attestation && {
            généréeLe: payload.corrigéLe,
            format: candidature.notification.attestation.format,
          },
        }
      : candidature.notification
    : undefined;

  return {
    identifiantProjet: identifiantProjet.formatter(),
    appelOffre: identifiantProjet.appelOffre,
    période: identifiantProjet.période,
    ...Candidature.Dépôt.convertirEnValueType(payload).formatter(),
    ...Candidature.Instruction.convertirEnValueType(payload).formatter(),
    estNotifiée: Option.isSome(candidature) ? candidature.estNotifiée : false,
    notification,
    misÀJourLe: payload.corrigéLe,
    détailsMisÀJourLe: payload.détailsMisÀJour
      ? payload.corrigéLe
      : Option.isSome(candidature)
        ? candidature.détailsMisÀJourLe
        : // ce cas est théoriquement impossible,
          // on ne peut pas avoir de correction sur une candidature non importée
          payload.corrigéLe,
  };
};
