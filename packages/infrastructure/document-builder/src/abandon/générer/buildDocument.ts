import ReactPDF, { Font } from '@react-pdf/renderer';
import dotenv from 'dotenv';
import {
  RéponseAbandonAvecRecandidature,
  RéponseAbandonAvecRecandidatureProps,
} from './RéponseAbandonAvecRecandidature';
import { GénérerRéponseAccordAbandonAvecRecandidaturePort } from '@potentiel-domain/document';
import { mapToReadableStream } from '../../mapToReadableStream';

dotenv.config();

Font.register({
  family: 'Arimo',
  fonts: [
    {
      src: process.env.BASE_URL + '/fonts/arimo/Arimo-Regular.ttf',
    },
    {
      src: process.env.BASE_URL + '/fonts/arimo/Arimo-Bold.ttf',
      fontWeight: 'bold',
    },
    {
      src: process.env.BASE_URL + '/fonts/arimo/Arimo-Italic.ttf',
      fontStyle: 'italic',
    },
  ],
});

const buildDocument: GénérerRéponseAccordAbandonAvecRecandidaturePort = async (
  props: RéponseAbandonAvecRecandidatureProps,
): Promise<ReadableStream> => {
  const document = RéponseAbandonAvecRecandidature(props);

  return await mapToReadableStream(await ReactPDF.renderToStream(document));
};

export { buildDocument };
