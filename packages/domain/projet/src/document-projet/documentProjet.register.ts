import {
  ConsulterDocumentProjetDependencies,
  registerConsulterDocumentProjetQuery,
} from './consulter/consulterDocumentProjet.query.js';
import {
  CorrigerDocumentProjetDependencies,
  registerCorrigerDocumentProjetCommand,
} from './corriger/corrigerDocumentProjet.command.js';
import {
  DéplacerDossierProjetDependencies,
  registerDéplacerDossierProjetCommand,
} from './déplacer/déplacerDocumentProjet.command.js';
import {
  EnregistrerDocumentProjetDependencies,
  registerEnregistrerDocumentProjetCommand,
} from './enregistrer/enregistrerDocument.command.js';
import {
  EnregistrerDocumentSubstitutCommandDependencies,
  registerEnregistrerDocumentSubstitutCommand,
} from './enregistrer/enregistrerDocumentSubstitut.command.js';

type DocumentProjetQueryDependencies = ConsulterDocumentProjetDependencies;
type DocumentProjetCommandDependencies = EnregistrerDocumentProjetDependencies &
  DéplacerDossierProjetDependencies &
  CorrigerDocumentProjetDependencies &
  EnregistrerDocumentSubstitutCommandDependencies;

export const registerDocumentProjetQueries = (dependencies: DocumentProjetQueryDependencies) => {
  registerConsulterDocumentProjetQuery(dependencies);
};

export const registerDocumentProjetCommand = (dependencies: DocumentProjetCommandDependencies) => {
  registerEnregistrerDocumentProjetCommand(dependencies);
  registerDéplacerDossierProjetCommand(dependencies);
  registerCorrigerDocumentProjetCommand(dependencies);
  registerEnregistrerDocumentSubstitutCommand(dependencies);
};
