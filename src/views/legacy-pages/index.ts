import { Request } from 'express'
import { PageLayout } from '../components'
import { makeHtml } from '../index.html'
import AdminAppelOffre from './adminAppelOffre'
import AdminNotifyCandidates from './adminNotifyCandidates'
import AdminRegenerateCertificates from './adminRegenerateCertificates'
import AdminUsers from './adminUsers'
import DrealList from './drealList'
import ImportCandidates from './importCandidates'
import InvitationList from './invitationList'
import NotificationList from './notificationList'
import ModificationRequestList from './modificationRequestList'
import InvitationsAreDeprecated from './invitationsAreDeprecated'
import ListProjects from './listProjects'
import SuccessOrError from './successOrError'
import ListMissingOwnerProjects from './listMissingOwnerProjects'
import FakeLogin from './fakeLogin'

const AdminNotifyCandidatesPage = makePresenterPage(AdminNotifyCandidates)
const AdminRegenerateCertificatesPage = makePresenterPage(AdminRegenerateCertificates)
const ImportCandidatesPage = makePresenterPage(ImportCandidates)
const ListProjectsPage = makePresenterPage(ListProjects)
const DrealListPage = makePresenterPage(DrealList)
const InvitationListPage = makePresenterPage(InvitationList)
const NotificationListPage = makePresenterPage(NotificationList)
const ModificationRequestListPage = makePresenterPage(ModificationRequestList)
const SuccessOrErrorPage = makePresenterPage(SuccessOrError)
const AdminAppelOffrePage = makePresenterPage(AdminAppelOffre)
const AdminUsersPage = makePresenterPage(AdminUsers)
const ListMissingOwnerProjectsPage = makePresenterPage(ListMissingOwnerProjects)
const InvitationsAreDeprecatedPage = makePresenterPage(InvitationsAreDeprecated)
const FakeLoginPage = makePresenterPage(FakeLogin)

export {
  ImportCandidatesPage,
  ListProjectsPage,
  AdminNotifyCandidatesPage,
  DrealListPage,
  InvitationListPage,
  NotificationListPage,
  ModificationRequestListPage,
  SuccessOrErrorPage as SuccessPage,
  AdminAppelOffrePage,
  AdminUsersPage,
  AdminRegenerateCertificatesPage,
  ListMissingOwnerProjectsPage,
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
