import ReactPDF, { Font } from '@react-pdf/renderer';
import dotenv from 'dotenv';
import { RéponseAbandonAvecRecandidature } from './RéponseAbandonAvecRecandidature';

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

const buildDocument = (): Promise<NodeJS.ReadableStream> => {
  const document = RéponseAbandonAvecRecandidature();
  return ReactPDF.renderToStream(document);
};

export { buildDocument };
