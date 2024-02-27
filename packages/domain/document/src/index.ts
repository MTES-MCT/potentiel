import {
  ConsulterDocumentProjetQuery,
  RécupérerDocumentProjetPort,
} from './consulter/consulterDocumentProjet.query';
import {
  DéplacerDossierProjetCommand,
  DéplacerDossierProjetPort,
} from './déplacer/déplacerDocument.command';
import {
  EnregistrerDocumentProjetCommand,
  EnregistrerDocumentProjetPort,
} from './enregistrer/enregistrerDocument.command';
import {
  SupprimerDocumentProjetCommand,
  SupprimerDocumentProjetPort,
} from './supprimer/supprimerDocumentProjet.query';

// Query
export type DocumentProjetQuery = ConsulterDocumentProjetQuery;

export { ConsulterDocumentProjetQuery };

// Command
export type DocumentProjetCommand =
  | EnregistrerDocumentProjetCommand
  | DéplacerDossierProjetCommand
  | SupprimerDocumentProjetCommand;

export {
  EnregistrerDocumentProjetCommand,
  DéplacerDossierProjetCommand as DéplacerDocumentProjetCommand,
  SupprimerDocumentProjetCommand,
};

// Register
export * from './register';

// ValueType
export * as DocumentProjet from './documentProjet.valueType';
export * as DossierProjet from './dossierProjet.valueType';

// Port
export {
  RécupérerDocumentProjetPort,
  EnregistrerDocumentProjetPort,
  DéplacerDossierProjetPort,
  SupprimerDocumentProjetPort,
};
