import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { GarantiesFinancières } from '@potentiel-domain/laureat';
import { getLogger } from '@potentiel-libraries/monitoring';
import { formatDatesFromDataToFrFormat } from '../../formatDatesFromDataToFrFormat';
import { formatIdentifiantProjetForDocument } from '../../formatIdentifiantProjetForDocument';

export const getModèleMiseEnDemeureGarantiesFinancières: GarantiesFinancières.BuildModèleMiseEnDemeureGarantiesFinancièresPort =
  async ({ data }) => {
    const imageToInject = path.resolve(
      __dirname,
      '../../../../../applications/ssr/public/logo_dreals',
      `${data.dreal}.png`,
    );

    const content = fs.readFileSync(path.resolve(__dirname, 'modeleMiseEnDemeure.docx'), 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    doc.render(
      formatDatesFromDataToFrFormat({
        data: {
          ...data,
          referenceProjet: formatIdentifiantProjetForDocument(data.referenceProjet),
        },
        keys: [
          'dateMiseEnDemeure',
          'dateLancementAppelOffre',
          'dateNotification',
          'dateFinGarantieFinanciere',
          'dateLimiteDepotGF',
        ],
      }),
    );

    if (imageToInject) {
      try {
        const imageContents = fs.readFileSync(imageToInject, 'binary');
        zip.file('word/media/image1.png', imageContents, { binary: true });
      } catch (e) {
        getLogger().error(e as Error);
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
