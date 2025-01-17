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
  registerDéplacerDocumentCommand,
} from './déplacer/déplacerDocument.command';
import {
  EnregistrerDocumentProjetDependencies,
  registerEnregistrerDocumentCommand,
} from './enregistrer/enregistrerDocument.command';
import {
  SupprimerDocumentProjetSensibleDependencies,
  registerSupprimerDocumentProjetSensible,
} from './supprimer/supprimerDocumentProjetSensible.command';

type DocumentProjetQueryDependencies = ConsulterDocumentProjetDependencies;
type DocumentProjetCommandDependencies = EnregistrerDocumentProjetDependencies &
  DéplacerDossierProjetDependencies &
  CorrigerDocumentProjetDependencies &
  SupprimerDocumentProjetSensibleDependencies;

export const registerDocumentProjetQueries = (dependencies: DocumentProjetQueryDependencies) => {
  registerConsulterDocumentProjetQuery(dependencies);
};

export const registerDocumentProjetCommand = (dependencies: DocumentProjetCommandDependencies) => {
  registerEnregistrerDocumentCommand(dependencies);
  registerDéplacerDocumentCommand(dependencies);
  registerCorrigerDocumentProjetCommand(dependencies);
  registerSupprimerDocumentProjetSensible(dependencies);
};
