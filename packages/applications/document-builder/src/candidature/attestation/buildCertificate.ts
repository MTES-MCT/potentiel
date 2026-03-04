import path from 'node:path';

import ReactPDF, { Font } from '@react-pdf/renderer';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';

import { fontsFolderPath, imagesFolderPath } from '../../assets.js';
import { mapToReadableStream } from '../../mapToReadableStream.js';

import { makeCertificate } from './makeCertificate.js';
import { getDésignationCatégorie } from './helpers/getDésignationCatégorie.js';
import { getFinancementEtTemplate } from './helpers/getFinancementEtTemplate.js';
import { AttestationCandidatureOptions } from './AttestationCandidatureOptions.js';
import { formatPotentielId } from './helpers/formatPotentielId.js';

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

export type BuildCertificateProps = {
  appelOffre: AppelOffre.AppelOffreReadModel;
  période: AppelOffre.Periode;
  validateur: AppelOffre.Validateur;
  candidature: {
    identifiantProjet: IdentifiantProjet.ValueType;
    dépôt: Candidature.Dépôt.ValueType;
    instruction: Candidature.Instruction.ValueType;
    unitéPuissance: Candidature.UnitéPuissance.ValueType;
    technologie: Candidature.TypeTechnologie.ValueType<AppelOffre.Technologie>;
  };
  notifiéLe: DateTime.RawType;
};

export const buildCertificate = async ({
  appelOffre,
  période,
  validateur,
  candidature,
  notifiéLe,
}: BuildCertificateProps): Promise<ReadableStream | void> => {
  const { data } = mapToCertificateData({
    appelOffre,
    période,
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
};

const mapToCertificateData = ({
  appelOffre,
  période,
  candidature,
  notifiéLe,
}: Omit<BuildCertificateProps, 'validateur'>): CertificateData => {
  const famille = période.familles.find((x) => x.id === candidature.identifiantProjet.famille);

  const financementEtTemplate = getFinancementEtTemplate({
    période,
    actionnariat: candidature.dépôt.actionnariat,
  });

  if (!financementEtTemplate) {
    return {};
  }

  const potentielId = formatPotentielId(candidature.identifiantProjet);

  return {
    data: {
      appelOffre,
      période,
      famille,

      unitePuissance: candidature.unitéPuissance.formatter(),
      notifiedOn: new Date(notifiéLe).getTime(),
      isClasse: candidature.instruction.statut.estClassé(),
      potentielId,

      nomProjet: candidature.dépôt.nomProjet,
      adresseProjet: [
        ...candidature.dépôt.localité.adresse1.split('\n'),
        ...(candidature.dépôt.localité.adresse2?.split('\n') ?? []),
      ]
        .filter(Boolean)
        .join(', '),
      codePostalProjet: candidature.dépôt.localité.codePostal,
      communeProjet: candidature.dépôt.localité.commune,

      nomCandidat: candidature.dépôt.nomCandidat,
      nomRepresentantLegal: candidature.dépôt.nomReprésentantLégal,
      email: candidature.dépôt.emailContact.formatter(),

      evaluationCarbone: candidature.dépôt.evaluationCarboneSimplifiée,
      prixReference: candidature.dépôt.prixReference,
      puissance: candidature.dépôt.puissance,
      technologie: candidature.technologie.type,
      engagementFournitureDePuissanceAlaPointe: candidature.dépôt.puissanceALaPointe,
      motifsElimination: candidature.instruction.motifÉlimination ?? '',

      désignationCatégorie: getDésignationCatégorie({
        puissance: candidature.dépôt.puissance,
        note: candidature.instruction.noteTotale,
        periodeDetails: période,
      }),
      coefficientKChoisi: candidature.dépôt.coefficientKChoisi,
      autorisation: candidature.dépôt.autorisation
        ? {
            date: candidature.dépôt.autorisation.date.date,
            numéro: candidature.dépôt.autorisation.numéro,
          }
        : undefined,

      ...financementEtTemplate,
    },
  };
};
