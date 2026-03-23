import { getLogger } from '@potentiel-libraries/monitoring';
import { Option } from '@potentiel-libraries/monads';

import { getDossier } from './getDossier.js';
import {
  récupérerAttestationGarantiesFinancièresAvecPlusieursFichiers,
  récupérerFichier,
} from './_helpers/index.js';
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
      dépôt: { dateConstitutionGf },
    } = dossier;

    if (!dateConstitutionGf) {
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

    if (fichiersGarantiesFinancières.length > 1) {
      return await récupérerAttestationGarantiesFinancièresAvecPlusieursFichiers({
        dossierNumber,
        dateConstitution: dateConstitutionGf,
        attestations: fichiersGarantiesFinancières,
      });
    }

    const fichier = await récupérerFichier({
      attestation: fichiersGarantiesFinancières[0],
      dossierNumber,
    });

    return {
      attestation: {
        content: (await fichier.blob()).stream(),
        format: fichiersGarantiesFinancières[0].contentType,
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
