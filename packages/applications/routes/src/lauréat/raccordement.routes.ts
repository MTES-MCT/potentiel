import { withFilters } from '../_helpers/withFilters.js';
import { encodeParameter } from '../encodeParameter.js';

export const lister = `/reseaux/raccordements`;
export const importer = `/reseaux/raccordements/importer`;

export const détail = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/raccordements`;

export const corrigerRéférencesDossier = `/reseaux/raccordements/references:corriger`;
export const corrigerRéférenceDossier = (
  identifiantProjet: string,
  référenceDossierRaccordement: string,
) =>
  `/laureats/${encodeParameter(identifiantProjet)}/raccordements/${encodeParameter(
    référenceDossierRaccordement,
  )}/reference:corriger`;

export const modifierGestionnaireDeRéseau = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/raccordements/gestionnaire:modifier`;

export const transmettreDemandeComplèteRaccordement = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(
    identifiantProjet,
  )}/raccordements/demande-complete-raccordement:transmettre`;

export const modifierDemandeComplèteRaccordement = (
  identifiantProjet: string,
  référenceDossierRaccordement: string,
) =>
  `/laureats/${encodeParameter(identifiantProjet)}/raccordements/${encodeParameter(
    référenceDossierRaccordement,
  )}/demande-complete-raccordement:modifier`;

// viovio : à supprimer
export const transmettrePropositionTechniqueEtFinancière = (
  identifiantProjet: string,
  référenceDossierRaccordement: string,
) =>
  `/laureats/${encodeParameter(identifiantProjet)}/raccordements/${encodeParameter(
    référenceDossierRaccordement,
  )}/proposition-technique-et-financiere:transmettre`;

export const modifierPropositionTechniqueEtFinancière = (
  identifiantProjet: string,
  référenceDossierRaccordement: string,
) =>
  `/laureats/${encodeParameter(identifiantProjet)}/raccordements/${encodeParameter(
    référenceDossierRaccordement,
  )}/proposition-technique-et-financiere:modifier`;

export const document = {
  transmettre: (identifiantProjet: string, référenceDossierRaccordement: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/raccordements/${encodeParameter(
      référenceDossierRaccordement,
    )}/document/transmettre`,
  modifier: (identifiantProjet: string, référenceDossierRaccordement: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/raccordements/${encodeParameter(
      référenceDossierRaccordement,
    )}/document/modifier`,
  supprimer: (identifiantProjet: string, référenceDossierRaccordement: string) =>
    `/laureats/${encodeParameter(identifiantProjet)}/raccordements/${encodeParameter(
      référenceDossierRaccordement,
    )}/document/supprimer`,
};

export const transmettreDateMiseEnService = (
  identifiantProjet: string,
  référenceDossierRaccordement: string,
) =>
  `/laureats/${encodeParameter(identifiantProjet)}/raccordements/${encodeParameter(
    référenceDossierRaccordement,
  )}/date-mise-en-service/transmettre`;

export const modifierDateMiseEnService = (
  identifiantProjet: string,
  référenceDossierRaccordement: string,
) =>
  `/laureats/${encodeParameter(identifiantProjet)}/raccordements/${encodeParameter(
    référenceDossierRaccordement,
  )}/date-mise-en-service/modifier`;

export const exporter = withFilters<{
  appelOffre?: string[];
  periode?: string;
  famille?: string;
  statut?: string[];
  typeActionnariat?: string[];
  PPA?: boolean;
}>(`/reseaux/raccordements/exporter`);
