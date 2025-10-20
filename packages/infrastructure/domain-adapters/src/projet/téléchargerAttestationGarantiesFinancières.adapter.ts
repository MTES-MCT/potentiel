import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { getAttestationGarantiesFinancières } from '@potentiel-infrastructure/ds-api-client';

import { loadAppelOffreAggregateAdapter } from '../appel-offre/loadAppelOffreAggregate.adapter';

export const téléchargerAttestationGarantiesFinancièresAdapter: Lauréat.GarantiesFinancières.TéléchargerAttestationGarantiesFinancièresPort =
  async (identifiantProjet) => {
    const ao = await loadAppelOffreAggregateAdapter(identifiantProjet.appelOffre);

    if (Option.isNone(ao)) {
      throw new Error("Appel d'offre introuvable");
    }

    const périodeCible = ao.periodes.find((p) => p.id === identifiantProjet.période);

    if (!périodeCible) {
      throw new Error('Période introuvable');
    }

    if (!périodeCible.numéroDémarche) {
      throw new Error(`La période ne dispose pas de démarche numéro de démarche`);
    }

    const attestationEtDateConstitution = await getAttestationGarantiesFinancières(
      Number(identifiantProjet.numéroCRE),
    );

    if (Option.isNone(attestationEtDateConstitution)) {
      throw new Error('Aucune garantie financière trouvée pour ce projet');
    }

    return {
      attestation: attestationEtDateConstitution.attestation,
      dateConstitution: attestationEtDateConstitution.dateConstitution,
    };
  };
