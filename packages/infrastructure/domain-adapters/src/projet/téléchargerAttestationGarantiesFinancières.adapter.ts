import { GetProjetAggregateRoot, Lauréat, ProjetAggregateRoot } from '@potentiel-domain/projet';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { Option } from '@potentiel-libraries/monads';

import { loadAppelOffreAggregateAdapter } from '../appel-offre/loadAppelOffreAggregate.adapter';

export const téléchargerAttestationGarantiesFinancièresAdapter: Lauréat.GarantiesFinancières.TéléchargerAttestationGarantiesFinancièresPort =
  async ({ appelOffres, période }) => {
    const ao = await loadAppelOffreAggregateAdapter(appelOffres);

    if (Option.isNone(ao)) {
      throw new Error("Appel d'offre introuvable");
    }

    const période = ao.périodes.find((p) => p.id === période);

    if (!période) {
      throw new Error('Période introuvable');
    }

    if (!période.numéroDémarche) {
      return;
    }

    const { numéroCRE: numéroDossierDS } = identifiantProjet;


    /*** TODO : va dans getAttestationGf
     *   const { url, dateConstitution } = gf;

    const fichier = await fetch(url);

    if (!fichier.ok) {
      throw new Error("Impossible de récupérer l'attestation de garanties financières");
    }

    if (!fichier.body) {
      throw new Error("Le fichier de l'attestation de garanties financières est introuvable");
    }
     * 
     */
    const attestation = await getAttestationGf(numeroDossierDS);

    if (Option.isNone(attestation)) {
      throw new Error('Aucune garantie financière trouvée pour ce projet');
    }

    return {
      attestation,
      dateConstitution: //formattage ?,
    }
  };
