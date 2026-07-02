import path from 'node:path';
import { Readable } from 'node:stream';

import ReactPDF, { Font } from '@react-pdf/renderer';

import { fontsFolderPath, imagesFolderPath } from '../assets.js';
import type { IntroductionProps } from './Introduction.js';
import { SynthèsePériode } from './SynthèsePériode.js';
import type { TableauLauréatPériodeProps } from './TableauLauréatsPériode.js';

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

export type GénérerSynthèsePériodePort = (données: DonnéesDocument) => Promise<ReadableStream>;

export type DonnéesDocument = {
  dateCourrier: string;
  période: IntroductionProps['période'];
  synthèse: IntroductionProps['synthèse'];
  lauréats: TableauLauréatPériodeProps['lauréats'];
};

const buildDocument: GénérerSynthèsePériodePort = async (
  props: DonnéesDocument,
): Promise<ReadableStream> => {
  const document = SynthèsePériode({ ...props, imagesFolderPath });

  const buffer = await ReactPDF.renderToStream(document);
  return Readable.toWeb(Readable.from(buffer));
};

export { buildDocument };
