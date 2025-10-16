import { Lauréat } from '@potentiel-domain/projet';

import { encodeParameter } from '../encodeParameter';
import { withFilters } from '../_helpers/withFilters';

type ListerMainlevéesFilters = {
  statut?: Lauréat.GarantiesFinancières.StatutMainlevéeGarantiesFinancières.RawType;
};

type ListerEnAttenteFilters = {
  statut?: Lauréat.StatutLauréat.RawType;
};

export const dépôt = {
  soumettre: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/garanties-financieres/depot:soumettre`,
  modifier: (identifiantProjet: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/garanties-financieres/depot:modifier`,
  lister: withFilters(`/garanties-financieres/depots-en-cours`),
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
  lister: withFilters<ListerMainlevéesFilters>(
    `/garanties-financieres/demandes-mainlevee-en-cours`,
  ),
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
  lister: withFilters<ListerEnAttenteFilters>(`/garanties-financieres/projets-en-attente`),
};
