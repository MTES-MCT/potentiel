import {
  ConsulterDocumentProjetDependencies,
  registerConsulterDocumentProjetQuery,
} from './consulter/consulterDocumentProjet.query';
import {
  DéplacerDocumentProjetDependencies,
  registerDéplacerDocumentCommand,
} from './déplacer/déplacerDocument.command';
import {
  EnregistrerDocumentProjetDependencies,
  registerEnregistrerDocumentCommand,
} from './enregistrer/enregistrerDocument.command';

type DocumentProjetQueryDependencies = ConsulterDocumentProjetDependencies;
type DocumentProjetCommandDependencies = EnregistrerDocumentProjetDependencies &
  DéplacerDocumentProjetDependencies;

export const registerDocumentProjetQueries = (dependencies: DocumentProjetQueryDependencies) => {
  registerConsulterDocumentProjetQuery(dependencies);
};

export const registerDocumentProjetCommand = (dependencies: DocumentProjetCommandDependencies) => {
  registerEnregistrerDocumentCommand(dependencies);
  registerDéplacerDocumentCommand(dependencies);
};
