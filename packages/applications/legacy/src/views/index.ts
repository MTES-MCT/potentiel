import { makeHtml } from './index.html';
import {
  DemanderDelai,
  Error,
  ModificationRequest,
  ModificationRequestList,
  NewModificationRequest,
  ProjectDetails,
  SignalerDemandeDelai,
  ListeProjets,
  SuccèsOuErreur,
  AccèsNonAutorisé,
  DetailsDemandeDelai,
  CorrigerDelaiAccorde,
} from './pages';

export { App } from './App';

export const ProjectDetailsPage = (props: Parameters<typeof ProjectDetails>[0]) =>
  makeHtml({
    Component: ProjectDetails,
    props,
    title: props.project.nomProjet,
  });

export const NewModificationRequestPage = (props: Parameters<typeof NewModificationRequest>[0]) =>
  makeHtml({
    Component: NewModificationRequest,
    props,
    title: 'Nouvelle demande',
  });

export const ErrorPage = (props: Parameters<typeof Error>[0]) =>
  makeHtml({
    Component: Error,
    props,
    title: 'Erreur',
  });

export const ModificationRequestPage = (props: Parameters<typeof ModificationRequest>[0]) =>
  makeHtml({
    Component: ModificationRequest,
    props,
    title: 'Détails demande',
  });

export const DetailsDemandeDelaiPage = (props: Parameters<typeof DetailsDemandeDelai>[0]) =>
  makeHtml({
    Component: DetailsDemandeDelai,
    props,
    title: 'Détails demande délai',
  });

export const DemanderDelaiPage = (props: Parameters<typeof DemanderDelai>[0]) =>
  makeHtml({
    Component: DemanderDelai,
    props,
    title: 'Demander délai',
  });

export const ModificationRequestListPage = (props: Parameters<typeof ModificationRequestList>[0]) =>
  makeHtml({
    Component: ModificationRequestList,
    props,
    title: 'Demandes de modification',
  });

export const SignalerDemandeDelaiPage = (props: Parameters<typeof SignalerDemandeDelai>[0]) =>
  makeHtml({
    Component: SignalerDemandeDelai,
    props,
    title: 'Signaler demande de délai',
  });

export const ListeProjetsPage = (props: Parameters<typeof ListeProjets>[0]) =>
  makeHtml({
    Component: ListeProjets,
    props,
    title: 'Projets',
  });

export const SuccèsOuErreurPage = (props: Parameters<typeof SuccèsOuErreur>[0]) =>
  makeHtml({
    Component: SuccèsOuErreur,
    props,
  });

export const AccèsNonAutoriséPage = (props: Parameters<typeof AccèsNonAutorisé>[0]) =>
  makeHtml({
    Component: AccèsNonAutorisé,
    props,
  });

export const CorrigerDelaiAccordePage = (props: Parameters<typeof CorrigerDelaiAccorde>[0]) =>
  makeHtml({
    Component: CorrigerDelaiAccorde,
    props,
    title: 'Corriger un délai accordé',
  });
