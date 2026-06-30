import type { Lauréat } from '@potentiel-domain/projet';
import { getAttestationGarantiesFinancières } from '@potentiel-infrastructure/dn-api-client';
import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';

import { loadAppelOffreAggregateAdapter } from '../appel-offre/loadAppelOffreAggregate.adapter.js';

export const récupererConstitutionGarantiesFinancièresAdapter: Lauréat.GarantiesFinancières.RécupererConstitutionGarantiesFinancièresPort =
  async (identifiantProjet) => {
    const ao = await loadAppelOffreAggregateAdapter(identifiantProjet.appelOffre);
    const logger = getLogger('récupererConstitutionGarantiesFinancièresAdapter');

    if (Option.isNone(ao)) {
      throw new Error("Appel d'offre introuvable");
    }

    const périodeCible = ao.periodes.find((p) => p.id === identifiantProjet.période);

    if (!périodeCible) {
      throw new Error('Période introuvable');
    }

    // Pour les périodes importées via CSV, on a uniquement le type de GF, dans la candidatures
    if (périodeCible.typeImport !== 'démarche-numérique') {
      return undefined;
    }

    const attestationEtDateConstitution = await getAttestationGarantiesFinancières(
      Number(identifiantProjet.numéroCRE),
    );

    if (Option.isNone(attestationEtDateConstitution)) {
      logger.warn('Aucune garantie financière trouvée pour ce projet');
      return;
    }

    return {
      dateConstitution: attestationEtDateConstitution.dateConstitution,
      attestation: {
        format: attestationEtDateConstitution.attestation.format,
        content: attestationEtDateConstitution.attestation.content,
      },
    };
  };
