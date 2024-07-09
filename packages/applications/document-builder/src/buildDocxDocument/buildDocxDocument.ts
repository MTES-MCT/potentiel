import fs from 'fs';
import path from 'path';

import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

const assetsFolderPath = path.resolve(__dirname, '..', 'assets');
const imagesFolderPath = path.resolve(assetsFolderPath, 'images');
const docxFolderPath = path.resolve(assetsFolderPath, 'docx');

type ModèleRéponseAbandon = {
  type: 'abandon';
  data: {
    aprèsConfirmation: boolean;

    suiviPar: string; // user qui édite le document
    suiviParEmail: string; // email dgec var env
    refPotentiel: string; // identifiantProjet

    dreal: string; // région projet

    status: string;

    nomRepresentantLegal: string;
    nomCandidat: string;
    adresseCandidat: string;
    email: string;

    titrePeriode: string;
    titreAppelOffre: string;
    familles: 'yes' | '';
    titreFamille: string;
    dateNotification: string;

    nomProjet: string;
    codePostalProjet: string;
    communeProjet: string;
    puissance: string;
    unitePuissance: string;

    dateDemande: string;
    justificationDemande: string;

    referenceParagrapheAbandon: string;
    contenuParagrapheAbandon: string;

    dateDemandeConfirmation: string;
    dateConfirmation: string;

    enCopies: Array<string>;
  };
};

type ModèleRéponseMainlevée = {
  type: 'mainlevée';
  data: {
    dreal: string;
    contactDreal: string;

    dateCourrier: string;
    referenceProjet: string;

    titrePeriode: string;
    titreAppelOffre: string;

    nomProjet: string;
    nomRepresentantLegal: string;
    adresseProjet: string;
    codePostalProjet: string;
    communeProjet: string;
    emailProjet: string;

    dateConstitutionGarantiesFinancières: string;

    estMotifAchèvement: boolean;
    dateTransmissionAuCocontractant: string;

    estMotifAbandon: boolean;
    dateAbandonAccordé: string;

    estAccordée: boolean;
    dateMainlevée: string;
  };
};

type ModèleMiseEnDemeure = {
  type: 'mise-en-demeure';
  data: {
    dreal: string;
    dateMiseEnDemeure: string;
    contactDreal: string;
    referenceProjet: string;
    titreAppelOffre: string;
    dateLancementAppelOffre: string;
    nomProjet: string;
    adresseCompleteProjet: string;
    puissanceProjet: string;
    unitePuissance: string;
    titrePeriode: string;
    dateNotification: string;
    paragrapheGF: string;
    garantieFinanciereEnMois: string;
    dateFinGarantieFinanciere: string;
    dateLimiteDepotGF: string;
    nomRepresentantLegal: string;
    adresseProjet: string;
    codePostalProjet: string;
    communeProjet: string;
    emailProjet: string;
  };
};

export type OptionsGénération = { logo?: string } & (
  | ModèleRéponseAbandon
  | ModèleMiseEnDemeure
  | ModèleRéponseMainlevée
);

export type GénérerModèleDocumentPort = (options: OptionsGénération) => Promise<ReadableStream>;

export const buildDocxDocument: GénérerModèleDocumentPort = async ({ type, logo, data }) => {
  const templateFilePath = getTemplateFilePath(type);

  const content = fs.readFileSync(templateFilePath, 'binary');
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render(data);

  if (logo) {
    const logoFilePath = path.resolve(imagesFolderPath, `${logo}.png`);
    try {
      const imageContents = fs.readFileSync(logoFilePath, 'binary');
      zip.file('word/media/image1.png', imageContents, { binary: true });
    } catch (e) {
      console.log(e);
    }
  }

  const buf = doc.getZip().generate({
    type: 'nodebuffer',
    // compression: DEFLATE adds a compression step.
    // For a 50MB output document, expect 500ms additional CPU time
    compression: 'DEFLATE',
  });

  return new ReadableStream({
    start: async (controller) => {
      controller.enqueue(buf);
      controller.close();
    },
  });
};

const getTemplateFilePath = (type: OptionsGénération['type']) => {
  switch (type) {
    case 'abandon':
      return path.resolve(docxFolderPath, 'abandon-modèle-réponse.docx');

    case 'mainlevée':
      return path.resolve(docxFolderPath, 'garanties-financières-mainlevée-modèle-réponse.docx');

    case 'mise-en-demeure':
      return path.resolve(docxFolderPath, 'garanties-financières-modèle-mise-en-demeure.docx');
  }
};
