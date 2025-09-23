import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { AppelOffre } from '@potentiel-domain/appel-offre';

export const candidatureCorrigéeProjector = async ({
  payload,
}: Candidature.CandidatureCorrigéeEvent) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

  const candidature = await findProjection<Candidature.CandidatureEntity>(
    `candidature|${identifiantProjet.formatter()}`,
  );
  const appelOffres = await findProjection<AppelOffre.AppelOffreEntity>(
    `appel-offre|${identifiantProjet.appelOffre}`,
  );
  if (Option.isNone(appelOffres)) {
    throw new Error("Appel d'offres non trouvé");
  }

  const candidatureToUpsert = mapToCandidatureToUpsert({
    payload,
    candidature,
    identifiantProjet,
    appelOffres,
  });

  await upsertProjection<Candidature.CandidatureEntity>(
    `candidature|${payload.identifiantProjet}`,
    candidatureToUpsert,
  );
};

export const mapToCandidatureToUpsert = ({
  payload,
  candidature,
  identifiantProjet,
  appelOffres,
}: {
  payload: Candidature.CandidatureCorrigéeEvent['payload'];
  candidature: Option.Type<Candidature.CandidatureEntity>;
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffres: AppelOffre.AppelOffreEntity;
}): Omit<Candidature.CandidatureEntity, 'type'> => {
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

  const technologie = Candidature.TypeTechnologie.déterminer({
    appelOffre: appelOffres,
    projet: payload,
  });

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
    technologieCalculée: technologie.formatter(),
    unitéPuissanceCalculée: Candidature.UnitéPuissance.déterminer({
      appelOffres,
      période: identifiantProjet.période,
      technologie: technologie.formatter(),
    }).formatter(),
  };
};
