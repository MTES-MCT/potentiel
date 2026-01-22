import { AppelOffre } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet, Candidature } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getAppelOffres } from './_helpers/getAppelOffres.js';

export const candidatureImportéeProjector = async ({
  payload,
}: Candidature.CandidatureImportéeEvent) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);
  const appelOffres = await getAppelOffres(identifiantProjet);
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
  appelOffres: AppelOffre.AppelOffreReadModel;
}): Omit<Candidature.CandidatureEntity, 'type'> => {
  const technologie = Candidature.TypeTechnologie.déterminer({
    appelOffre: appelOffres,
    projet: payload,
  });

  return {
    identifiantProjet: payload.identifiantProjet,
    appelOffre: identifiantProjet.appelOffre,
    période: identifiantProjet.période,
    famille: identifiantProjet.famille,
    ...Candidature.Dépôt.convertirEnValueType(payload).formatter(),
    ...Candidature.Instruction.convertirEnValueType(payload).formatter(),
    estNotifiée: false,
    notification: undefined,
    miseÀJourLe: payload.importéLe,
    détailsMisÀJourLe: payload.importéLe,
    technologieCalculée: technologie.formatter(),
    unitéPuissance: Candidature.UnitéPuissance.déterminer({
      appelOffres,
      période: identifiantProjet.période,
      technologie: technologie.formatter(),
    }).formatter(),
  };
};
