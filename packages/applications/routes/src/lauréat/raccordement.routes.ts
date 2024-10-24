import { encodeParameter } from '../encodeParameter';

export const détail = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/raccordements`;

export const importer = `/reseaux/raccordements/importer`;
export const corrigerRéférencesDossier = `/reseaux/raccordements/references:corriger`;

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

export const transmettreDateMiseEnService = (
  identifiantProjet: string,
  référenceDossierRaccordement: string,
) =>
  `/laureats/${encodeParameter(identifiantProjet)}/raccordements/${encodeParameter(
    référenceDossierRaccordement,
  )}/date-mise-en-service:transmettre`;

export const modifierDateMiseEnService = (
  identifiantProjet: string,
  référenceDossierRaccordement: string,
) =>
  `/laureats/${encodeParameter(identifiantProjet)}/raccordements/${encodeParameter(
    référenceDossierRaccordement,
  )}/date-mise-en-service:modifier`;
