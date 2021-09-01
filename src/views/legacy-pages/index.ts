import { Request } from 'express'
import { PageLayout } from '../components'
import { makeHtml } from '../index.html'
import AdminAppelOffre from './adminAppelOffre'
import AdminNotifyCandidates from './adminNotifyCandidates'
import AdminRegenerateCertificates from './adminRegenerateCertificates'
import AdminUsers from './adminUsers'
import DrealList from './drealList'
import ImportCandidates from './importCandidates'
import NewModificationRequest from './newModificationRequest'
import ModificationRequestDetails from './modificationRequestDetails'
import ProjectDetails from './projectDetails'
import InvitationList from './invitationList'
import NotificationList from './notificationList'
import ModificationRequestList from './modificationRequestList'
import InvitationsAreDeprecated from './invitationsAreDeprecated'
import ListProjects from './listProjects'
import Success from './success'
import FakeLogin from './fakeLogin'

const AdminNotifyCandidatesPage = makePresenterPage(AdminNotifyCandidates)
const AdminRegenerateCertificatesPage = makePresenterPage(AdminRegenerateCertificates)
const ImportCandidatesPage = makePresenterPage(ImportCandidates)
const ListProjectsPage = makePresenterPage(ListProjects)
const NewModificationRequestPage = makePresenterPage(NewModificationRequest)
const ProjectDetailsPage = makePresenterPage(ProjectDetails)
const DrealListPage = makePresenterPage(DrealList)
const InvitationListPage = makePresenterPage(InvitationList)
const NotificationListPage = makePresenterPage(NotificationList)
const ModificationRequestDetailsPage = makePresenterPage(ModificationRequestDetails)
const ModificationRequestListPage = makePresenterPage(ModificationRequestList)
const SuccessPage = makePresenterPage(Success)
const AdminAppelOffrePage = makePresenterPage(AdminAppelOffre)
const AdminUsersPage = makePresenterPage(AdminUsers)
const InvitationsAreDeprecatedPage = makePresenterPage(InvitationsAreDeprecated)
const FakeLoginPage = makePresenterPage(FakeLogin)

export {
  ImportCandidatesPage,
  ListProjectsPage,
  NewModificationRequestPage,
  AdminNotifyCandidatesPage,
  AdminRegenerateCertificatesPage,
  ProjectDetailsPage,
  DrealListPage,
  InvitationListPage,
  NotificationListPage,
  ModificationRequestDetailsPage,
  ModificationRequestListPage,
  SuccessPage,
  AdminAppelOffrePage,
  AdminUsersPage,
  InvitationsAreDeprecatedPage,
  FakeLoginPage,
}

interface HasRequest {
  request: Request
}

/**
 * Turn a Page Component (pure) into a presenter that returns a full HTML page
 * @param pageComponent
 */
/* global JSX */
function makePresenterPage<T extends HasRequest>(pageComponent: (pageProps: T) => JSX.Element) {
  return (props: T): string =>
    makeHtml({ Component: PageLayout(pageComponent), props, hydrate: false })
}
