import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

type getModèleRéponseAbandonProps = {
  aprèsConfirmation: boolean;
  data: {
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

    isEDFOA: string;
    isEDFSEI: string;
    isEDM: string;
  };
};

export const getModèleRéponseAbandon = async ({
  aprèsConfirmation,
  data,
}: getModèleRéponseAbandonProps) => {
  const content = fs.readFileSync(
    path.resolve(
      __dirname,
      aprèsConfirmation
        ? 'Modèle réponse Abandon après confirmation.docx'
        : 'Modèle réponse Abandon.docx',
    ),
    'binary',
  );
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });
  doc.render(data);

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
