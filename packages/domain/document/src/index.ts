import {
  ConsulterDocumentProjetQuery,
  RécupérerDocumentProjetPort,
} from './consulter/consulterDocumentProjet.query';
import { DéplacerDocumentProjetCommand } from './déplacer/déplacerDocument.command';
import {
  EnregistrerDocumentProjetCommand,
  EnregistrerDocumentProjetPort,
} from './enregistrer/enregistrerDocument.command';

// Query
export type DocumentProjetQuery = ConsulterDocumentProjetQuery;

export { ConsulterDocumentProjetQuery };

// Command
export type DocumentProjetCommand =
  | EnregistrerDocumentProjetCommand
  | DéplacerDocumentProjetCommand;

export { EnregistrerDocumentProjetCommand, DéplacerDocumentProjetCommand };

// Register
export * from './register';

// ValueType
export * as DocumentProjet from './documentProjet.valueType';

// Port
export { RécupérerDocumentProjetPort, EnregistrerDocumentProjetPort };
