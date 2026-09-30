import type {
  ConsulterDocumentProjetQuery,
  ConsulterDocumentProjetReadModel,
  RécupérerDocumentProjetPort,
} from './consulter/consulterDocumentProjet.query.js';
import type {
  ArchiverDocumentProjetPort,
  CorrigerDocumentProjetCommand,
} from './corriger/corrigerDocumentProjet.command.js';
import type {
  DéplacerDocumentsProjetCommand,
  DéplacerDocumentsProjetPort,
} from './déplacer/déplacerDocumentsProjet.command.js';
import type {
  DéplacerDossierProjetCommand,
  DéplacerDossierProjetPort,
} from './déplacer/déplacerDossierProjet.command.js';
import type {
  EnregistrerDocumentProjetCommand,
  EnregistrerDocumentProjetPort,
} from './enregistrer/enregistrerDocument.command.js';
import type {
  EnregistrerDocumentSubstitutCommand,
  EnregistrerDocumentSubstitutPort,
} from './enregistrer/enregistrerDocumentSubstitut.command.js';

// Query
export type DocumentProjetQuery = ConsulterDocumentProjetQuery;

// Read model
export type { ConsulterDocumentProjetQuery, ConsulterDocumentProjetReadModel };

// Command
export type DocumentProjetCommand =
  | EnregistrerDocumentProjetCommand
  | DéplacerDocumentsProjetCommand
  | CorrigerDocumentProjetCommand
  | EnregistrerDocumentSubstitutCommand
  | DéplacerDossierProjetCommand;

// Register
export * from './documentProjet.register.js';
// ValueType
export * as DocumentProjet from './documentProjet.valueType.js';
export * as DossierProjet from './dossierProjet.valueType.js';
// Port
export type {
  ArchiverDocumentProjetPort,
  CorrigerDocumentProjetCommand,
  DéplacerDocumentsProjetCommand,
  DéplacerDocumentsProjetPort,
  DéplacerDossierProjetCommand,
  DéplacerDossierProjetPort,
  EnregistrerDocumentProjetCommand,
  EnregistrerDocumentProjetPort,
  EnregistrerDocumentSubstitutCommand,
  EnregistrerDocumentSubstitutPort,
  RécupérerDocumentProjetPort,
};
