import { makeHtml } from './index.html';
import {
  AbonnementLettreInformation,
  AdemeStatistiques,
  AdminStatistiques,
  DemanderDelai,
  Error,
  ModificationRequest,
  ModificationRequestList,
  NewModificationRequest,
  ProjectDetails,
  SignalerDemandeDelai,
  Signup,
  ChangerProducteur,
  DemanderChangementPuissance,
  ChoisirCahierDesCharges,
  ChangerFournisseur,
  ListeProjets,
  SuccèsOuErreur,
  AccèsNonAutorisé,
  AcheteurObligeStatistiques,
  CreStatistiques,
  DetailsDemandeDelai,
  CorrigerDelaiAccorde,
} from './pages';

export { App } from './App';

export const AdminStatistiquesPage = (props: Parameters<typeof AdminStatistiques>[0]) =>
  makeHtml({
    Component: AdminStatistiques,
    props,
    title: 'Tableau de bord',
  });

export const AdemeStatistiquesPage = (props: Parameters<typeof AdemeStatistiques>[0]) =>
  makeHtml({
    Component: AdemeStatistiques,
    props,
    title: 'Tableau de bord',
  });

export const AcheteurObligeStatistiquesPage = (
  props: Parameters<typeof AcheteurObligeStatistiques>[0],
) =>
  makeHtml({
    Component: AcheteurObligeStatistiques,
    props,
    title: 'Tableau de bord',
  });

export const CreStatistiquesPage = (props: Parameters<typeof CreStatistiques>[0]) =>
  makeHtml({
    Component: CreStatistiques,
    props,
    title: 'Tableau de bord',
  });

export const ProjectDetailsPage = (props: Parameters<typeof ProjectDetails>[0]) =>
  makeHtml({
    Component: ProjectDetails,
    props,
    title: props.project.nomProjet,
  });

export const ChoisirCahierDesChargesPage = (props: Parameters<typeof ChoisirCahierDesCharges>[0]) =>
  makeHtml({
    Component: ChoisirCahierDesCharges,
    props,
    title: 'Changer de cahier des charges',
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

export const DemanderChangementPuissancePage = (
  props: Parameters<typeof DemanderChangementPuissance>[0],
) =>
  makeHtml({
    Component: DemanderChangementPuissance,
    props,
    title: 'Demander changement de puissance',
  });

export const ChangerProducteurPage = (props: Parameters<typeof ChangerProducteur>[0]) =>
  makeHtml({
    Component: ChangerProducteur,
    props,
    title: 'Changer producteur',
  });

export const ChangerFournisseurPage = (props: Parameters<typeof ChangerFournisseur>[0]) =>
  makeHtml({
    Component: ChangerFournisseur,
    props,
    title: 'Changer fournisseur',
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

export const SignupPage = (props: Parameters<typeof Signup>[0]) =>
  makeHtml({
    Component: Signup,
    props,
    title: 'Inscription',
  });

export const AbonnementLettreInformationPage = (
  props: Parameters<typeof AbonnementLettreInformation>[0],
) =>
  makeHtml({
    Component: AbonnementLettreInformation,
    props,
    title: 'Abdonnement lettre information',
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
