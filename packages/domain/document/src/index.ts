import { ConsulterDocumentProjetQuery } from './consulter/consulterDocumentProjet.query';
import { EnregistrerDocumentProjetCommand } from './enregistrer/enregistrerDocument.command';

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
