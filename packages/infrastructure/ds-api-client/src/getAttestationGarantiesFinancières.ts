import { extension } from 'mime-types';
import PizZip from 'pizzip';

import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';
import { DateTime } from '@potentiel-domain/common';
import { mergeDocuments } from '@potentiel-libraries/pdf';

import { getDossier } from './getDossier.js';
import { getGarantiesFinancièresFiles } from './getGarantiesFinancièresFiles.js';

export const getAttestationGarantiesFinancières = async (dossierNumber: number) => {
  const logger = getLogger('ds-api-client');
  logger.debug(
    `Récupération de l'attestation de garanties financières du dossier ${dossierNumber}`,
  );
  try {
    const dossier = await getDossier(dossierNumber);

    if (Option.isNone(dossier)) {
      logger.warn(`Dossier ${dossierNumber} introuvable`);
      return Option.none;
    }

    const {
      dépôt: { dateConstitutionGf: dateConstitution },
    } = dossier;

    if (!dateConstitution) {
      logger.warn(
        `Aucune date de constitution de garanties financières pour le dossier ${dossierNumber}`,
      );
      return Option.none;
    }

    const fichiersGarantiesFinancières = await getGarantiesFinancièresFiles(dossierNumber);

    if (fichiersGarantiesFinancières.length === 0) {
      logger.warn(`Aucun fichier de garanties financières trouvé pour le dossier ${dossierNumber}`);
      return Option.none;
    }

    const { attestation } = await récupérerAttestationGarantiesFinancières({
      dossierNumber,
      dateConstitution,
      attestations: fichiersGarantiesFinancières,
    });

    return {
      attestation,
      dateConstitution,
    };
  } catch (e) {
    logger.warn(
      `Impossible de récupérer l'attestation de garanties financières du dossier ${dossierNumber}`,
      {
        dossierNumber,
        errorMessage: e instanceof Error ? e.message : 'unknown',
        errorData: e,
      },
    );
    return Option.none;
  }
};

type RécupérerAttestationGarantiesFinancièresProps = {
  dateConstitution: DateTime.RawType;
  dossierNumber: number;
  attestations: Array<{ url: string; contentType: string }>;
};

const récupérerAttestationGarantiesFinancières = async ({
  dossierNumber,
  dateConstitution,
  attestations,
}: RécupérerAttestationGarantiesFinancièresProps) => {
  if (attestations.length === 1) {
    const [attestationFile] = attestations;
    const fichier = await récupérerFichier({ attestation: attestationFile, dossierNumber });

    return {
      dateConstitution,
      attestation: {
        content: (await fichier.blob()).stream(),
        format: attestationFile.contentType,
      },
    };
  }

  const documents = [];

  for (let i = 0; i < attestations.length; i++) {
    const attestation = attestations[i];
    const fichier = await récupérerFichier({ attestation, dossierNumber });

    const fileName =
      new URL(attestation.url).searchParams.get('filename') ??
      `attestation-${i}.${extension(attestation.contentType)}`;

    documents.push({ fileName, content: await fichier.blob() });
  }

  const isPdfOnly = attestations.every((a) => a.contentType === 'application/pdf');

  const attestation = isPdfOnly
    ? {
        content: (await mergeDocuments(documents.map((d) => d.content))).stream(),
        format: 'application/pdf',
      }
    : {
        content: (await zipDocuments(documents)).stream(),
        format: 'application/zip',
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

type RécupérerFichierProps = {
  attestation: {
    url: string;
    contentType: string;
  };
  dossierNumber: number;
};

const récupérerFichier = async ({ attestation, dossierNumber }: RécupérerFichierProps) => {
  const fichier = await fetch(attestation.url);

  if (!fichier.ok) {
    throw new Error(
      `Impossible de récupérer l'attestation de garanties financières pour le dossier ${dossierNumber}`,
    );
  }

  if (!fichier.body) {
    throw new Error(
      `Le fichier de l'attestation de garanties financières est introuvable pour le dossier ${dossierNumber}`,
    );
  }
  return fichier;
};
