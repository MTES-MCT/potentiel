import PizZip from 'pizzip';
import { extension } from 'mime-types';

import { DateTime } from '@potentiel-domain/common';
import { mergeDocuments } from '@potentiel-libraries/pdf';

import { récupérerFichier } from './index.js';

type RécupérerAttestationAvecPlusieursFichiersProps = {
  dateConstitution: DateTime.RawType;
  dossierNumber: number;
  attestations: Array<{ url: string; contentType: string }>;
};

export const récupérerAttestationGarantiesFinancièresAvecPlusieursFichiers = async ({
  dossierNumber,
  dateConstitution,
  attestations,
}: RécupérerAttestationAvecPlusieursFichiersProps) => {
  const documents: Array<{
    fileName: string;
    content: Blob;
  }> = [];

  for (let i = 0; i < attestations.length; i++) {
    const attestation = attestations[i];
    const fichier = await récupérerFichier({ attestation, dossierNumber });

    const fileName =
      new URL(attestation.url).searchParams.get('filename') ??
      `attestation-${i}.${extension(attestation.contentType)}`;

    documents.push({ fileName, content: await fichier.blob() });
  }

  const plusieurFichiersAvecDesFormatsDifférents =
    new Set(attestations.map((a) => a.contentType)).size > 1;

  const attestation = plusieurFichiersAvecDesFormatsDifférents
    ? {
        content: (await zipDocuments(documents)).stream(),
        format: 'application/zip',
      }
    : {
        content: (await mergeDocuments(documents.map((d) => d.content))).stream(),
        format: 'application/pdf',
      };

  return {
    dateConstitution,
    attestation,
  };
};

const zipDocuments = async (
  documents: Array<{
    fileName: string;
    content: Blob;
  }>,
  options: Omit<PizZip.GenerateOptions, 'type'> = {
    compression: 'DEFLATE',
    mimeType: 'application/zip',
  },
) => {
  const zip = new PizZip();

  for (let i = 0; i < documents.length; i++) {
    const document = documents[i];
    const arrayBuffer = await document.content.arrayBuffer();

    zip.file(document.fileName, arrayBuffer);
  }

  return zip.generate({ ...options, type: 'blob' });
};
