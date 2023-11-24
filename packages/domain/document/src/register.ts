import {
  GénérerRéponseAccordAbandonAvecRecandidatureDependencies,
  registerGénérerRéponseAccordAbandonAvecRecandidatureQuery,
} from './abandon/générerRéponseAccordAbandonAvecRecandidature.query';
import {
  ConsulterDocumentProjetDependencies,
  registerConsulterDocumentProjetQuery,
} from './consulter/consulterDocumentProjet.query';
import {
  EnregistrerDocumentProjetDependencies,
  registerEnregistrerDocumentCommand,
} from './enregistrer/enregistrerDocument.command';

type DocumentProjetQueryDependencies = ConsulterDocumentProjetDependencies &
  GénérerRéponseAccordAbandonAvecRecandidatureDependencies;
type DocumentProjetCommandDependencies = EnregistrerDocumentProjetDependencies;

export const registerDocumentProjetQueries = (dependencies: DocumentProjetQueryDependencies) => {
  registerConsulterDocumentProjetQuery(dependencies);
  registerGénérerRéponseAccordAbandonAvecRecandidatureQuery(dependencies);
};

export const registerDocumentProjetCommand = (dependencies: DocumentProjetCommandDependencies) => {
  registerEnregistrerDocumentCommand(dependencies);
};
