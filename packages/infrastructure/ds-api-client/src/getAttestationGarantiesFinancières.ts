import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';
import { mergeDocuments } from '@potentiel-libraries/pdf';

import { getDossier } from './getDossier.js';

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
      dépôt: { dateConstitutionGf, attestationConstitutionGf },
    } = dossier;

    if (!attestationConstitutionGf.length) {
      logger.warn(`Aucune attestation de garanties financières pour le dossier ${dossierNumber}`);
      return Option.none;
    }

    if (!dateConstitutionGf) {
      logger.warn(
        `Aucune date de constitution de garanties financières pour le dossier ${dossierNumber}`,
      );
      return Option.none;
    }

    if (attestationConstitutionGf.length > 1) {
      const documents = [];

      for (const attestation of attestationConstitutionGf) {
        const fichier = await récupérerFichier(attestation, dossierNumber);

        documents.push(await fichier.blob());
      }

      const content = (await mergeDocuments(documents)).stream();

      return {
        dateConstitution: dateConstitutionGf,
        attestation: {
          content,
          format: 'application/pdf',
        },
      };
    }

    const fichier = await récupérerFichier(attestationConstitutionGf[0], dossierNumber);

    return {
      attestation: {
        content: (await fichier.blob()).stream(),
        format: attestationConstitutionGf[0].contentType,
      },
      dateConstitution: dateConstitutionGf,
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

const récupérerFichier = async (
  attestation: { url: string; contentType: string },
  dossierNumber: number,
) => {
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
