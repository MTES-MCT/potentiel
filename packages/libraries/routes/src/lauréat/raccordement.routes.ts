import { encodeParameter } from '../encodeParameter';

export const détail = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/raccordements`;

export const modifierGestionnaireDeRéseau = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(identifiantProjet)}/raccordements/modifier-gestionnaire-de-reseau`;

export const transmettreDemandeComplèteDeRaccordement = (identifiantProjet: string) =>
  `/laureats/${encodeParameter(
    identifiantProjet,
  )}/raccordements/transmettre-demande-complete-de-raccordement`;

export const modifierDemandeComplèteDeRaccordement = (
  identifiantProjet: string,
  référenceDossierRaccordement: string,
) =>
  `/laureats/${encodeParameter(identifiantProjet)}/raccordements/${encodeParameter(
    référenceDossierRaccordement,
  )}/modifier-demande-complete-de-raccordement`;

export const transmettrePropositionTechniqueEtFinancière = (
  identifiantProjet: string,
  référenceDossierRaccordement: string,
) =>
  `/laureats/${encodeParameter(identifiantProjet)}/raccordements/${encodeParameter(
    référenceDossierRaccordement,
  )}/transmettre-technique-et-financiere`;

export const modifierPropositionTechniqueEtFinancière = (
  identifiantProjet: string,
  référenceDossierRaccordement: string,
) =>
  `/laureats/${encodeParameter(identifiantProjet)}/raccordements/${encodeParameter(
    référenceDossierRaccordement,
  )}/modifier-technique-et-financiere`;

export const transmettreDateMiseEnService = (
  identifiantProjet: string,
  référenceDossierRaccordement: string,
) =>
  `/laureats/${encodeParameter(identifiantProjet)}/raccordements/${encodeParameter(
    référenceDossierRaccordement,
  )}/transmettre-date-mise-en-service`;
