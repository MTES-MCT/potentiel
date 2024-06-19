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
  GénérerModèleDocumentPort,
  OptionsGénération,
} from './générerModèleDocument/générerModèleDocument.port';

// Query
export type DocumentProjetQuery = ConsulterDocumentProjetQuery;

export { ConsulterDocumentProjetQuery };

// Command
export type DocumentProjetCommand = EnregistrerDocumentProjetCommand | DéplacerDossierProjetCommand;

export {
  EnregistrerDocumentProjetCommand,
  DéplacerDossierProjetCommand as DéplacerDocumentProjetCommand,
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
  GénérerModèleDocumentPort,
  OptionsGénération,
};
