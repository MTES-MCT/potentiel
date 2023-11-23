import {
  ConsulterDocumentProjetQuery,
  RécupérerDocumentProjetPort,
} from './consulter/consulterDocumentProjet.query';
import {
  EnregistrerDocumentProjetCommand,
  EnregistrerDocumentProjetPort,
} from './enregistrer/enregistrerDocument.command';

// Query
export type DocumentProjetQuery = ConsulterDocumentProjetQuery;

export { ConsulterDocumentProjetQuery };

// Command
export type DocumentProjetCommand = EnregistrerDocumentProjetCommand;

export { EnregistrerDocumentProjetCommand };

// Register
export * from './register';

// ValueType
export * as DocumentProjet from './documentProjet.valueType';

// Port
export { RécupérerDocumentProjetPort, EnregistrerDocumentProjetPort };

// Just for testing
export { buildDocument } from './abandon/générer/buildDocument';
