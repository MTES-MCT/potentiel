import {
  ConsulterDocumentProjetReadModel,
  ConsulterDocumentProjetQuery,
  RécupérerDocumentProjetPort,
} from './consulter/consulterDocumentProjet.query';
import {
  ArchiverDocumentProjetPort,
  CorrigerDocumentProjetCommand,
} from './corriger/corrigerDocumentProjet.command';
import {
  DéplacerDossierProjetCommand,
  DéplacerDossierProjetPort,
} from './déplacer/déplacerDocumentProjet.command';
import {
  EnregistrerDocumentProjetCommand,
  EnregistrerDocumentProjetPort,
} from './enregistrer/enregistrerDocument.command';
import {
  EnregistrerDocumentSubstitutCommand,
  EnregistrerDocumentSubstitutPort,
} from './enregistrer/enregistrerDocumentSubstitut.command';

// Query
export type DocumentProjetQuery = ConsulterDocumentProjetQuery;
export { ConsulterDocumentProjetQuery };

// Read model
export { ConsulterDocumentProjetReadModel };

// Command
export type DocumentProjetCommand =
  | EnregistrerDocumentProjetCommand
  | DéplacerDossierProjetCommand
  | CorrigerDocumentProjetCommand
  | EnregistrerDocumentSubstitutCommand;

export {
  EnregistrerDocumentProjetCommand,
  DéplacerDossierProjetCommand as DéplacerDocumentProjetCommand,
  CorrigerDocumentProjetCommand,
  EnregistrerDocumentSubstitutCommand,
};

// Register
export * from './documentProjet.register';

// ValueType
export * as DocumentProjet from './documentProjet.valueType';
export * as DossierProjet from './dossierProjet.valueType';

// Port
export {
  RécupérerDocumentProjetPort,
  EnregistrerDocumentProjetPort,
  DéplacerDossierProjetPort,
  ArchiverDocumentProjetPort,
  EnregistrerDocumentSubstitutPort,
};
