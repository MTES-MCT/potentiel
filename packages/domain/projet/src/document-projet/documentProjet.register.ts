import {
  ConsulterDocumentProjetDependencies,
  registerConsulterDocumentProjetQuery,
} from './consulter/consulterDocumentProjet.query';
import {
  CorrigerDocumentProjetDependencies,
  registerCorrigerDocumentProjetCommand,
} from './corriger/corrigerDocumentProjet.command';
import {
  DéplacerDossierProjetDependencies,
  registerDéplacerDocumentProjetCommand,
} from './déplacer/déplacerDocumentProjet.command';
import {
  EnregistrerDocumentProjetDependencies,
  registerEnregistrerDocumentProjetCommand,
} from './enregistrer/enregistrerDocument.command';
import {
  EnregistrerDocumentSubstitutCommandDependencies,
  registerEnregistrerDocumentSubstitutCommand,
} from './enregistrer/enregistrerDocumentSubstitut.command';

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
  registerDéplacerDocumentProjetCommand(dependencies);
  registerCorrigerDocumentProjetCommand(dependencies);
  registerEnregistrerDocumentSubstitutCommand(dependencies);
};
