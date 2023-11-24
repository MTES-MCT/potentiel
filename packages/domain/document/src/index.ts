import {
  GénérerRéponseAccordAbandonAvecRecandidaturePort,
  GénérerRéponseAccordAbandonAvecRecandidatureQuery,
} from './abandon/générerRéponseAccordAbandonAvecRecandidature.query';
import {
  ConsulterDocumentProjetQuery,
  RécupérerDocumentProjetPort,
} from './consulter/consulterDocumentProjet.query';
import {
  EnregistrerDocumentProjetCommand,
  EnregistrerDocumentProjetPort,
} from './enregistrer/enregistrerDocument.command';

// Query
export type DocumentProjetQuery =
  | ConsulterDocumentProjetQuery
  | GénérerRéponseAccordAbandonAvecRecandidatureQuery;

export { ConsulterDocumentProjetQuery, GénérerRéponseAccordAbandonAvecRecandidatureQuery };

// Command
export type DocumentProjetCommand = EnregistrerDocumentProjetCommand;

export { EnregistrerDocumentProjetCommand };

// Register
export * from './register';

// ValueType
export * as DocumentProjet from './documentProjet.valueType';

// Port
export {
  RécupérerDocumentProjetPort,
  EnregistrerDocumentProjetPort,
  GénérerRéponseAccordAbandonAvecRecandidaturePort,
};
