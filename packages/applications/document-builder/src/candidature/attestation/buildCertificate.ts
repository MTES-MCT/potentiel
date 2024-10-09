import path from 'node:path';

import ReactPDF, { Font } from '@react-pdf/renderer';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';
import { ConsulterUtilisateurReadModel } from '@potentiel-domain/utilisateur';

import { fontsFolderPath, imagesFolderPath } from '../../assets';
import { mapToReadableStream } from '../../mapToReadableStream';

import { makeCertificate } from './makeCertificate';
import { getDésignationCatégorie } from './helpers/getDésignationCatégorie';
import { getFinancementEtTemplate } from './helpers/getFinancementEtTemplate';
import { AttestationCandidatureOptions } from './AttestationCandidatureOptions';
import { formatPotentielId } from './helpers/formatPotentielId';

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

type BuildCertificateProps = {
  appelOffre: AppelOffre.AppelOffreReadModel;
  période: AppelOffre.Periode;
  utilisateur: ConsulterUtilisateurReadModel;
  candidature: Candidature.ConsulterCandidatureReadModel;
  notifiéLe: DateTime.RawType;
};

export const buildCertificate = async ({
  appelOffre,
  période,
  utilisateur,
  candidature,
  notifiéLe,
}: BuildCertificateProps): Promise<ReadableStream | void> => {
  const { data, validateur } = mapToCertificateData({
    appelOffre,
    période,
    utilisateur,
    candidature,
    notifiéLe,
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

type CertificateData = {
  data?: AttestationCandidatureOptions;
  validateur?: AppelOffre.Validateur;
};

const mapToCertificateData = ({
  appelOffre,
  période,
  utilisateur,
  candidature,
  notifiéLe,
}: BuildCertificateProps): CertificateData => {
  const famille = période.familles.find((x) => x.id === candidature.identifiantProjet.famille);

  const financementEtTemplate = getFinancementEtTemplate({
    période,
    candidature,
  });

  if (!financementEtTemplate) {
    return {};
  }

  const potentielId = formatPotentielId(candidature.identifiantProjet);

  return {
    validateur: {
      fullName: utilisateur.nomComplet,
      fonction: utilisateur.fonction,
    },
    data: {
      appelOffre,
      période,
      famille,

      notifiedOn: new Date(notifiéLe).getTime(),
      isClasse: candidature.statut.estClassé(),
      potentielId,

      nomProjet: candidature.nomProjet,
      adresseProjet: [
        ...candidature.localité.adresse1.split('\n'),
        ...(candidature.localité.adresse2?.split('\n') ?? []),
      ]
        .filter(Boolean)
        .join(', '),
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
