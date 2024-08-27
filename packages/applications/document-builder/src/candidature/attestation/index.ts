import path from 'node:path';

import ReactPDF, { Font } from '@react-pdf/renderer';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { fontsFolderPath } from '../../assets';
import { mapToReadableStream } from '../../mapToReadableStream';

import { makeCertificate as makeCre4V0Certificate } from './cre4.v0/makeCertificate';
import { makeCertificate as makeCre4V1Certificate } from './cre4.v1/makeCertificate';
import { makeCertificate as makePpe2V1Certificate } from './ppe2.v1';
import { makeCertificate as makePpe2V2Certificate } from './ppe2.v2';
import { AttestationCandidatureOptions } from './AttestationCandidatureOptions';

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

export const buildCertificate = async ({
  template,
  data,
  validateur,
}: {
  template: AppelOffre.CertificateTemplate;
  data: AttestationCandidatureOptions;
  validateur: AppelOffre.Validateur;
}): Promise<ReadableStream> => {
  const content = (() => {
    switch (template) {
      case 'cre4.v0':
        return makeCre4V0Certificate(data, validateur);
      case 'cre4.v1':
        return makeCre4V1Certificate(data, validateur);
      case 'ppe2.v1':
        return makePpe2V1Certificate(data, validateur);
      case 'ppe2.v2':
        return makePpe2V2Certificate(data, validateur);
    }
  })();

  return await mapToReadableStream(await ReactPDF.renderToStream(content));
};
