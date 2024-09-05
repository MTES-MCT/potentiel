import ReactPDF from '@react-pdf/renderer';

import { mapToReadableStream } from '../mapToReadableStream';

import { TestDocument } from './TestDocument';

const buildTestDocument = async (): Promise<ReadableStream> => {
  const document = TestDocument();

  return await mapToReadableStream(await ReactPDF.renderToStream(document));
};

export { buildTestDocument };
