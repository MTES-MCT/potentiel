import path from 'node:path';

import { mediator } from 'mediateur';
import ReactPDF, { Font } from '@react-pdf/renderer';

import { Option } from '@potentiel-libraries/monads';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';
import { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';

import { fontsFolderPath, imagesFolderPath } from '../../assets';
import { mapToReadableStream } from '../../mapToReadableStream';

import { makeCertificate } from './makeCertificate';
import { getDésignationCatégorie } from './helpers/getDésignationCatégorie';
import { getFinancementEtTemplate } from './helpers/getFinancementEtTemplate';
import { AttestationCandidatureOptions } from './AttestationCandidatureOptions';

Font.register({
  family: 'Arimo',
  fonts: [
    {
      src: path.join(fontsFolderPath, '/arimo/Arimo-Regular.ttf'),
    },
    {
      src: path.join(fontsFolderPath, '/arimo/Arimo-Bold.ttf'),
      fontWeight: 'bold',
    },
    {
      src: path.join(fontsFolderPath, '/arimo/Arimo-Italic.ttf'),
      fontStyle: 'italic',
    },
  ],
});

type BuildCertificate = {
  identifiantProjet: string;
  notifiéLe: DateTime.RawType;
  notifiéPar: string;
};

export const buildCertificate = async ({
  identifiantProjet,
  notifiéLe,
  notifiéPar,
}: BuildCertificate): Promise<ReadableStream | void> => {
  const { data, validateur } = await mapToCertificateData({
    identifiantProjet,
    notifiéLe,
    notifiéPar,
  });

  if (!data || !validateur) {
    return;
  }

  const content = makeCertificate({
    data,
    validateur,
    imagesFolderPath,
  });

  return await mapToReadableStream(await ReactPDF.renderToStream(content));
};

type MapToCertificateData = {
  data?: AttestationCandidatureOptions;
  validateur?: AppelOffre.Validateur;
};

const mapToCertificateData = async ({
  identifiantProjet,
  notifiéLe,
  notifiéPar,
}: BuildCertificate): Promise<MapToCertificateData> => {
  const logger = getLogger('System.Candidature.Attestation.Saga.Execute');

  const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isNone(candidature)) {
    logger.warn(`Candidature non trouvée`, { identifiantProjet });
    return {};
  }

  const appelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: { identifiantAppelOffre: candidature.identifiantProjet.appelOffre },
  });

  if (Option.isNone(appelOffres)) {
    logger.warn(`Appel d'offres non trouvé`, { identifiantProjet });
    return {};
  }

  const période = appelOffres.periodes.find((x) => x.id === candidature.identifiantProjet.période);

  if (!période) {
    logger.warn(`Période non trouvée`, { identifiantProjet });
    return {};
  }
  if (période.type && période.type !== 'notified') {
    logger.warn(`Période non notifiée`, { identifiantProjet, période });
    return {};
  }

  const utilisateur = await mediator.send<ConsulterUtilisateurQuery>({
    type: 'Utilisateur.Query.ConsulterUtilisateur',
    data: {
      identifiantUtilisateur: notifiéPar,
    },
  });

  if (Option.isNone(utilisateur)) {
    logger.warn(`Utilisateur non trouvé`, {
      identifiantProjet,
      identifiantUtilisateur: notifiéPar,
    });
    return {};
  }

  const famille = période.familles.find((x) => x.id === candidature.identifiantProjet.famille);

  const financementEtTemplate = getFinancementEtTemplate({
    période,
    candidature,
  });

  if (!financementEtTemplate) {
    return {};
  }

  return {
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
  };
};
