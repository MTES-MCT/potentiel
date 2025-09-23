import { AppelOffre } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet, Candidature } from '@potentiel-domain/projet';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { Option } from '@potentiel-libraries/monads';

export const candidatureImportéeProjector = async ({
  payload,
}: Candidature.CandidatureImportéeEvent) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);
  const appelOffres = await findProjection<AppelOffre.AppelOffreEntity>(
    `appel-offre|${identifiantProjet.appelOffre}`,
  );
  if (Option.isNone(appelOffres)) {
    throw new Error("Appel d'offres non trouvé");
  }
  const candidatureToUpsert = mapToCandidatureToUpsert({ appelOffres, identifiantProjet, payload });

  await upsertProjection<Candidature.CandidatureEntity>(
    `candidature|${payload.identifiantProjet}`,
    candidatureToUpsert,
  );
};

export const mapToCandidatureToUpsert = ({
  identifiantProjet,
  payload,
  appelOffres,
}: {
  identifiantProjet: IdentifiantProjet.ValueType;
  payload: Candidature.CandidatureImportéeEvent['payload'];
  appelOffres: AppelOffre.AppelOffreEntity;
}): Omit<Candidature.CandidatureEntity, 'type'> => {
  const technologie = Candidature.TypeTechnologie.déterminer({
    appelOffre: appelOffres,
    projet: payload,
  });

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
    technologieCalculée: technologie.formatter(),
    unitéPuissanceCalculée: Candidature.UnitéPuissance.déterminer({
      appelOffres,
      période: identifiantProjet.période,
      technologie: technologie.formatter(),
    }).formatter(),
  };
};
