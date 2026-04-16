import { IdentifiantProjet, Candidature } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getAppelOffres } from './_helpers/getAppelOffres.js';
import { getCoefficientK } from './_helpers/getCoefficientK.js';

export const candidatureImportéeProjector = async ({
  payload,
}: Candidature.CandidatureImportéeEvent) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);
  const candidatureToUpsert = await mapToCandidatureToUpsert({ identifiantProjet, payload });

  await upsertProjection<Candidature.CandidatureEntity>(
    `candidature|${payload.identifiantProjet}`,
    candidatureToUpsert,
  );
};

export const mapToCandidatureToUpsert = async ({
  identifiantProjet,
  payload,
}: {
  identifiantProjet: IdentifiantProjet.ValueType;
  payload: Candidature.CandidatureImportéeEvent['payload'];
}): Promise<Omit<Candidature.CandidatureEntity, 'type'>> => {
  const appelOffres = await getAppelOffres(identifiantProjet);
  const technologie = Candidature.TypeTechnologie.déterminer({
    appelOffre: appelOffres,
    projet: payload,
  });

  // champs supplémentaire pouvant avoir une valeur par défaut, non présente dans le payload de l'événement
  const coefficientKChoisi = getCoefficientK(
    appelOffres,
    identifiantProjet,
    technologie,
    payload.coefficientKChoisi,
  );

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
    technologieCalculée: technologie.formatter(),
    unitéPuissance: Candidature.UnitéPuissance.déterminer({
      appelOffres,
      période: identifiantProjet.période,
      technologie: technologie.formatter(),
    }).formatter(),
    coefficientKChoisi,
  };
};
