import {
  ConsulterDocumentProjetDependencies,
  registerConsulterDocumentProjetQuery,
} from './consulter/consulterDocumentProjet.query';
import {
  DéplacerDossierProjetDependencies,
  registerDéplacerDocumentCommand,
} from './déplacer/déplacerDocument.command';
import {
  EnregistrerDocumentProjetDependencies,
  registerEnregistrerDocumentCommand,
} from './enregistrer/enregistrerDocument.command';

type DocumentProjetQueryDependencies = ConsulterDocumentProjetDependencies;
type DocumentProjetCommandDependencies = EnregistrerDocumentProjetDependencies &
  DéplacerDossierProjetDependencies;

export const registerDocumentProjetQueries = (dependencies: DocumentProjetQueryDependencies) => {
  registerConsulterDocumentProjetQuery(dependencies);
};

export const registerDocumentProjetCommand = (dependencies: DocumentProjetCommandDependencies) => {
  registerEnregistrerDocumentCommand(dependencies);
  registerDéplacerDocumentCommand(dependencies);
};
