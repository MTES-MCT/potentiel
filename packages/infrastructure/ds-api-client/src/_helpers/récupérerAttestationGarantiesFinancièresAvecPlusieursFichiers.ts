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
  const documents = [];

  for (const attestation of attestations) {
    const fichier = await récupérerFichier({ attestation, dossierNumber });

    documents.push(await fichier.blob());
  }

  const plusieurFichiersAvecDesFormatsDifférents =
    new Set(attestations.map((a) => a.contentType)).size > 1;

  const attestation = plusieurFichiersAvecDesFormatsDifférents
    ? {
        content: (await zipDocuments(documents)).stream(),
        format: 'application/zip',
      }
    : {
        content: (await mergeDocuments(documents)).stream(),
        format: 'application/pdf',
      };

  return {
    dateConstitution,
    attestation,
  };
};

const zipDocuments = async (
  documents: Blob[],
  options: Omit<PizZip.GenerateOptions, 'type'> = {
    compression: 'DEFLATE',
    mimeType: 'application/zip',
  },
) => {
  const zip = new PizZip();

  for (let i = 0; i < documents.length; i++) {
    const document = documents[i];
    const arrayBuffer = await document.arrayBuffer();

    zip.file(`document-${i}.${extension(document.type)}`, arrayBuffer);
  }

  return zip.generate({ ...options, type: 'blob' });
};
