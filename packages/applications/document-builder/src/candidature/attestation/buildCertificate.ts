import path from 'node:path';

import ReactPDF, { Font } from '@react-pdf/renderer';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import { Candidature } from '@potentiel-domain/candidature';
import { ConsulterUtilisateurReadModel } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';

import { fontsFolderPath, imagesFolderPath } from '../../assets';
import { mapToReadableStream } from '../../mapToReadableStream';

import { makeCertificate } from './makeCertificate';
import { getDésignationCatégorie } from './helpers/getDésignationCatégorie';
import { getFinancementEtTemplate } from './helpers/getFinancementEtTemplate';
import { AttestationCandidatureOptions } from './AttestationCandidatureOptions';
import { buildProjectIdentifier } from './buildProjectIdentifier';

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
  const potentielIdentifierSecret = process.env.POTENTIEL_IDENTIFIER_SECRET;
  if (!potentielIdentifierSecret) {
    getLogger().error(new Error('POTENTIEL_IDENTIFIER_SECRET not specified'));
    process.exit(1);
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
      appelOffre,
      période,
      famille,

      notifiedOn: new Date(notifiéLe).getTime(),
      isClasse: candidature.statut.estClassé(),
      potentielId: buildProjectIdentifier(candidature.identifiantProjet, potentielIdentifierSecret),

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
