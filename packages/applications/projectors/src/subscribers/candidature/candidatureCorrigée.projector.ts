import { CahierDesCharges, Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { getAppelOffres, getPériodeAndFamille } from './_helpers/getAppelOffres.js';

export const candidatureCorrigéeProjector = async ({
  payload,
}: Candidature.CandidatureCorrigéeEvent) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);

  const candidature = await findProjection<Candidature.CandidatureEntity>(
    `candidature|${identifiantProjet.formatter()}`,
  );
  const appelOffres = await getAppelOffres(identifiantProjet);

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
  appelOffres: AppelOffre.AppelOffreReadModel;
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

  const { période, famille } = getPériodeAndFamille(identifiantProjet, appelOffres);
  const cahierDesCharges = CahierDesCharges.bind({
    appelOffre: appelOffres,
    période,
    famille,
    technologie: technologie.type,
    cahierDesChargesModificatif: undefined,
  });

  return {
    identifiantProjet: identifiantProjet.formatter(),
    appelOffre: identifiantProjet.appelOffre,
    période: identifiantProjet.période,
    famille: identifiantProjet.famille,
    ...Candidature.Dépôt.convertirEnValueType(payload).formatter(),
    ...Candidature.Instruction.convertirEnValueType(payload).formatter(),
    estNotifiée: Option.isSome(candidature) ? candidature.estNotifiée : false,
    notification,
    miseÀJourLe: payload.corrigéLe,
    technologieCalculée: technologie.formatter(),
    unitéPuissance: Candidature.UnitéPuissance.déterminer({
      appelOffres,
      période: identifiantProjet.période,
      technologie: technologie.formatter(),
    }).formatter(),
    coefficientKChoisi: (() => {
      const champCoefficientK = cahierDesCharges.getChampsSupplémentaires().coefficientKChoisi;
      return champCoefficientK?.type === 'défaut'
        ? champCoefficientK.valeurParDéfaut
        : payload.coefficientKChoisi;
    })(),
  };
};
