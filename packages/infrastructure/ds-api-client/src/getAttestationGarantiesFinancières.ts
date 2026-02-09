import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

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

    if (!attestationConstitutionGf) {
      logger.warn(`Aucune attestation de garanties financières pour le dossier ${dossierNumber}`);
      return Option.none;
    }

    if (!dateConstitutionGf) {
      logger.warn(
        `Aucune date de constitution de garanties financières pour le dossier ${dossierNumber}`,
      );
      return Option.none;
    }

    const { url, format } = attestationConstitutionGf;

    const fichier = await fetch(url);

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

    return {
      attestation: {
        content: fichier.body,
        format,
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
