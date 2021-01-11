import fs from 'fs'
import path from 'path'

import ReactDOMServer from 'react-dom/server'

import Header from '../components/header'
import Footer from '../components/footer'

import Login from './login'
import ListProjects from './listProjects'
import UserListRequests from './userListRequests'
import AdminListRequests from './adminListRequests'
import AdminNotifyCandidates from './adminNotifyCandidates'
import ImportCandidates from './importCandidates'
import Signup from './signup'
import NewModificationRequest from './newModificationRequest'
import ModificationRequestDetails from './modificationRequestDetails'
import ForgottenPassword from './forgottenPassword'
import ResetPassword from './resetPassword'
import ProjectDetails from './projectDetails'
import DrealList from './drealList'
import GarantiesFinancieresList from './garantiesFinancieresList'
import InvitationList from './invitationList'
import NotificationList from './notificationList'
import Statistiques from './statistiques'
import { HttpRequest } from '../../types'

const LoginPage = makePresenterPage(Login)
const AdminListRequestsPage = makePresenterPage(AdminListRequests)
const AdminNotifyCandidatesPage = makePresenterPage(AdminNotifyCandidates)
const ImportCandidatesPage = makePresenterPage(ImportCandidates)
const ListProjectsPage = makePresenterPage(ListProjects)
const UserListRequestsPage = makePresenterPage(UserListRequests)
const SignupPage = makePresenterPage(Signup)
const NewModificationRequestPage = makePresenterPage(NewModificationRequest)
const ForgottenPasswordPage = makePresenterPage(ForgottenPassword)
const ResetPasswordPage = makePresenterPage(ResetPassword)
const ProjectDetailsPage = makePresenterPage(ProjectDetails)
const DrealListPage = makePresenterPage(DrealList)
const GarantiesFinancieresListPage = makePresenterPage(GarantiesFinancieresList)
const InvitationListPage = makePresenterPage(InvitationList)
const NotificationListPage = makePresenterPage(NotificationList)
const StatistiquesPage = makePresenterPage(Statistiques)
const ModificationRequestDetailsPage = makePresenterPage(ModificationRequestDetails)

export {
  LoginPage,
  AdminListRequestsPage,
  ImportCandidatesPage,
  ListProjectsPage,
  UserListRequestsPage,
  SignupPage,
  NewModificationRequestPage,
  AdminNotifyCandidatesPage,
  ForgottenPasswordPage,
  ResetPasswordPage,
  ProjectDetailsPage,
  DrealListPage,
  GarantiesFinancieresListPage,
  InvitationListPage,
  NotificationListPage,
  StatistiquesPage,
  ModificationRequestDetailsPage,
}

interface HasRequest {
  request: HttpRequest
}

/**
 * Turn a Page Component (pure) into a presenter that returns a full HTML page
 * @param pageComponent
 */
/* global JSX */
function makePresenterPage<T extends HasRequest>(pageComponent: (pageProps: T) => JSX.Element) {
  return (props: T): string =>
    insertIntoHTMLTemplate(
      ReactDOMServer.renderToStaticMarkup(Header(props)) +
        ReactDOMServer.renderToStaticMarkup(pageComponent(props)) +
        ReactDOMServer.renderToStaticMarkup(Footer())
    )
}

const headerPartial = fs.readFileSync(path.resolve(__dirname, '../template/header.html.partial'))
const footerPartial = fs.readFileSync(path.resolve(__dirname, '../template/footer.html.partial'))

/**
 * Insert html contents into the full template
 * @param htmlContents
 */
function insertIntoHTMLTemplate(htmlContents: string): string {
  return headerPartial + htmlContents + footerPartial
}
