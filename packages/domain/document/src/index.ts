import {
  ConsulterDocumentProjetQuery,
  ConsulterDocumentProjetReadModel,
  RécupérerDocumentProjetPort,
} from './consulter/consulterDocumentProjet.query';
import {
  ArchiverDocumentProjetPort,
  CorrigerDocumentProjetCommand,
} from './corriger/corrigerDocumentProjet.command';
import {
  DéplacerDossierProjetCommand,
  DéplacerDossierProjetPort,
} from './déplacer/déplacerDocument.command';
import {
  EnregistrerDocumentProjetCommand,
  EnregistrerDocumentProjetPort,
} from './enregistrer/enregistrerDocument.command';

// Query
export type DocumentProjetQuery = ConsulterDocumentProjetQuery;
export { ConsulterDocumentProjetQuery };

// Read model
export { ConsulterDocumentProjetReadModel };

// Command
export type DocumentProjetCommand =
  | EnregistrerDocumentProjetCommand
  | DéplacerDossierProjetCommand
  | CorrigerDocumentProjetCommand;

export {
  EnregistrerDocumentProjetCommand,
  DéplacerDossierProjetCommand as DéplacerDocumentProjetCommand,
  CorrigerDocumentProjetCommand,
};

// ValueType
export * as DocumentProjet from './documentProjet.valueType';
export * as DossierProjet from './dossierProjet.valueType';
// Register
export * from './register';

// Port
export {
  RécupérerDocumentProjetPort,
  EnregistrerDocumentProjetPort,
  DéplacerDossierProjetPort,
  ArchiverDocumentProjetPort,
};
