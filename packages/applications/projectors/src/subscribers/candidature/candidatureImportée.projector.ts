import { IdentifiantProjet, Candidature, CahierDesCharges } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

import { getAppelOffres, getPériodeAndFamille } from './_helpers/getAppelOffres.js';

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
  const appelOffres = getAppelOffres(identifiantProjet);
  const { période, famille } = getPériodeAndFamille(identifiantProjet, appelOffres);
  const technologie = Candidature.TypeTechnologie.déterminer({
    appelOffre: appelOffres,
    projet: payload,
  });

  const cahierDesCharges = CahierDesCharges.bind({
    appelOffre: appelOffres,
    période,
    famille,
    technologie: technologie.type,
    cahierDesChargesModificatif: undefined,
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
    technologieCalculée: technologie.formatter(),
    unitéPuissance: Candidature.UnitéPuissance.déterminer({
      appelOffres,
      période: identifiantProjet.période,
      technologie: technologie.formatter(),
    }).formatter(),
    // champs supplémentaire pouvant avoir une valeur par défaut, non présente dans le payload de l'événement
    coefficientKChoisi: (() => {
      const champCoefficientK = cahierDesCharges.getChampsSupplémentaires().coefficientKChoisi;
      return champCoefficientK?.type === 'défaut'
        ? champCoefficientK.valeur
        : payload.coefficientKChoisi;
    })(),
  };
};
