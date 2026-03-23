import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

import { getDossier } from './getDossier.js';
import {
  récupérerAttestationGarantiesFinancièresAvecPlusieursFichiers,
  récupérerFichier,
} from './_helpers/index.js';

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
      return await récupérerAttestationGarantiesFinancièresAvecPlusieursFichiers({
        dossierNumber,
        dateConstitution: dateConstitutionGf,
        attestations: attestationConstitutionGf,
      });
    }

    const fichier = await récupérerFichier({
      attestation: attestationConstitutionGf[0],
      dossierNumber,
    });

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
