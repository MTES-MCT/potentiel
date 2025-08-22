import {
  type ConsulterDocumentProjetDependencies,
  registerConsulterDocumentProjetQuery,
} from './consulter/consulterDocumentProjet.query';
import {
  type CorrigerDocumentProjetDependencies,
  registerCorrigerDocumentProjetCommand,
} from './corriger/corrigerDocumentProjet.command';
import {
  type DéplacerDossierProjetDependencies,
  registerDéplacerDocumentCommand,
} from './déplacer/déplacerDocument.command';
import {
  type EnregistrerDocumentProjetDependencies,
  registerEnregistrerDocumentCommand,
} from './enregistrer/enregistrerDocument.command';

type DocumentProjetQueryDependencies = ConsulterDocumentProjetDependencies;
type DocumentProjetCommandDependencies = EnregistrerDocumentProjetDependencies &
  DéplacerDossierProjetDependencies &
  CorrigerDocumentProjetDependencies;

export const registerDocumentProjetQueries = (dependencies: DocumentProjetQueryDependencies) => {
  registerConsulterDocumentProjetQuery(dependencies);
};

export const registerDocumentProjetCommand = (dependencies: DocumentProjetCommandDependencies) => {
  registerEnregistrerDocumentCommand(dependencies);
  registerDéplacerDocumentCommand(dependencies);
  registerCorrigerDocumentProjetCommand(dependencies);
};
