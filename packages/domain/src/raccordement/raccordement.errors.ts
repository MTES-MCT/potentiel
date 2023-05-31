export class DossierRaccordementNonRéférencéError extends Error {
  constructor() {
    super(`Le dossier de raccordement n'est pas référencé`);
  }
}

export class PlusieursGestionnairesRéseauPourUnProjetError extends Error {
  constructor() {
    super(
      `Il est impossible de transmettre une demande complète de raccordement auprès de plusieurs gestionnaires de réseau`,
    );
  }
}

export class FormatFichierInexistantError extends Error {
  constructor() {
    super(`Il est impossible de télécharger le fichier car son format est inexistant.`);
  }
}

export class AucunDossierCorrespondantError extends Error {
  constructor() {
    super(`Aucun dossier ne correspond à la référence`);
  }
}
