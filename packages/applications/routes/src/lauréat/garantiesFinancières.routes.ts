import { Lauréat } from '@potentiel-domain/projet';

import { encodeParameter } from '../encodeParameter';

type ListerFilters = {
  statut?: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType;
};

export const dépôt = {
  soumettre: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/garanties-financieres/depot:soumettre`,
  modifier: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/garanties-financieres/depot:modifier`,
  lister: `/garanties-financieres/depots-en-cours`,
};

export const actuelles = {
  modifier: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/garanties-financieres/actuelles:modifier`,
  enregistrer: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/garanties-financieres/actuelles:enregistrer`,
  enregistrerAttestation: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(
      identifiantProjet,
    )}/garanties-financieres/actuelles:enregistrer-attestation`,
};

export const demandeMainlevée = {
  lister: (filters: ListerFilters) => {
    const searchParams = new URLSearchParams();

    if (filters?.statut) {
      searchParams.set('statut', filters.statut);
    }

    return `/garanties-financieres/demandes-mainlevee-en-cours${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  },
  téléchargerModèleRéponseAccordé: (identitifiantProjet: string) =>
    `/laureats/${encodeParameter(identitifiantProjet)}/garanties-financieres/modele-reponse-mainlevee?estAccordée=true`,
  téléchargerModèleRéponseRejeté: (identitifiantProjet: string) =>
    `/laureats/${encodeParameter(identitifiantProjet)}/garanties-financieres/modele-reponse-mainlevee?estAccordée=false`,
};

export const détail = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/garanties-financieres`;

export const téléchargerModèleMiseEnDemeure = (identitifiantProjet: string) =>
  `/laureats/${encodeParameter(identitifiantProjet)}/garanties-financieres/modele-mise-en-demeure`;

export const enAttente = {
  lister: `/garanties-financieres/projets-en-attente`,
};
