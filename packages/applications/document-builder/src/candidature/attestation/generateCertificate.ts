import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';
import { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { DateTime } from '@potentiel-domain/common';

import { buildCertificate } from './buildCertificate';

export const generateCertificate = async (
  identifiantProjet: string,
  notifiéLe: DateTime.RawType,
  identifiantUtilisateur: string,
) => {
  const logger = getLogger('System.Candidature.Attestation.Saga.Execute');

  const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(candidature)) {
    logger.warn(`Candidature non trouvée`, { identifiantProjet });
    return null;
  }

  const appelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: { identifiantAppelOffre: candidature.identifiantProjet.appelOffre },
  });

  if (Option.isNone(appelOffres)) {
    logger.warn(`Appel d'offres non trouvé`, { identifiantProjet });
    return null;
  }

  const période = appelOffres.periodes.find((x) => x.id === candidature.identifiantProjet.période);
  if (!période) {
    logger.warn(`Période non trouvée`, { identifiantProjet });
    return null;
  }
  if (période.type && période.type !== 'notified') {
    logger.warn(`Période non notifiée`, { identifiantProjet, période });
    return null;
  }

  const utilisateur = await mediator.send<ConsulterUtilisateurQuery>({
    type: 'Utilisateur.Query.ConsulterUtilisateur',
    data: {
      identifiantUtilisateur,
    },
  });
  if (Option.isNone(utilisateur)) {
    logger.warn(`Utilisateur non trouvé`, { identifiantProjet, identifiantUtilisateur });
    return null;
  }
  const famille = période.familles.find((x) => x.id === candidature.identifiantProjet.famille);
  const financementEtTemplate = await getFinancementEtTemplate({
    période,
    candidature,
  });
  if (!financementEtTemplate) {
    return null;
  }

  const content = await buildCertificate({
    validateur: {
      fullName: utilisateur.nomComplet,
      fonction: utilisateur.fonction,
    },
    data: {
      appelOffre: appelOffres,
      période,
      famille,

      notifiedOn: new Date(notifiéLe).getTime(),
      isClasse: candidature.statut.estClassé(),
      potentielId: candidature.identifiantProjet.formatter().replaceAll('#', '-'),

      nomProjet: candidature.nomProjet,
      adresseProjet: [candidature.localité.adresse1, candidature.localité.adresse2]
        .filter(Boolean)
        .join('\n'),
      codePostalProjet: candidature.localité.codePostal,
      communeProjet: candidature.localité.commune,

      nomCandidat: candidature.nomCandidat,
      nomRepresentantLegal: candidature.nomReprésentantLégal,
      email: candidature.emailContact,

      evaluationCarbone: candidature.evaluationCarboneSimplifiée,
      prixReference: candidature.prixReference,
      puissance: candidature.puissanceProductionAnnuelle,
      technologie: candidature.technologie.type,
      engagementFournitureDePuissanceAlaPointe: candidature.puissanceALaPointe,
      motifsElimination: candidature.motifÉlimination ?? '',

      désignationCatégorie: getDésignationCatégorie({
        puissance: candidature.puissanceProductionAnnuelle,
        note: candidature.noteTotale,
        periodeDetails: période,
      }),

      ...financementEtTemplate,
    },
  });
  return content;
};

const getDésignationCatégorie = ({
  puissance,
  note,
  periodeDetails,
}: {
  puissance: number;
  note: number;
  periodeDetails: AppelOffre.Periode;
}) => {
  if (periodeDetails.noteThresholdBy !== 'category') {
    return;
  }

  return puissance <= periodeDetails.noteThreshold.volumeReserve.puissanceMax &&
    note >= periodeDetails.noteThreshold.volumeReserve.noteThreshold
    ? 'volume-réservé'
    : 'hors-volume-réservé';
};

const getFinancementEtTemplate = async ({
  période,
  candidature,
}: {
  période: AppelOffre.Periode;
  candidature: Candidature.ConsulterCandidatureReadModel;
}) => {
  switch (période.certificateTemplate) {
    case 'cre4.v0':
    case 'cre4.v1':
      return {
        template: période.certificateTemplate,
        isFinancementParticipatif: candidature.actionnariat?.type === 'financement-participatif',
        isInvestissementParticipatif:
          candidature.actionnariat?.type === 'investissement-participatif',
      };
    default:
      return {
        template: période.certificateTemplate ?? 'ppe2.v2',
        actionnariat: candidature.actionnariat?.estÉgaleÀ(
          Candidature.TypeActionnariat.financementCollectif,
        )
          ? ('financement-collectif' as const)
          : candidature.actionnariat?.estÉgaleÀ(Candidature.TypeActionnariat.gouvernancePartagée)
            ? ('gouvernance-partagée' as const)
            : undefined,
      };
  }
};
