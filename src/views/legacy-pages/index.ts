import { Request } from 'express'
import { makeHtml } from '../index.html'
import AdminAppelOffre from './adminAppelOffre'
import AdminNotifyCandidates from './adminNotifyCandidates'
import AdminRegenerateCertificates from './adminRegenerateCertificates'
import ImportCandidates from './importCandidates'
import InvitationList from './invitationList'
import NotificationList from './notificationList'
import InvitationsAreDeprecated from './invitationsAreDeprecated'
import ListProjects from './listProjects'
import SuccessOrError from './successOrError'
import ListMissingOwnerProjects from './listMissingOwnerProjects'
import FakeLogin from './fakeLogin'
import { PageLayout } from '../components/PageLayout'

const AdminNotifyCandidatesPage = makePresenterPageWithLayout(AdminNotifyCandidates)
const AdminRegenerateCertificatesPage = makePresenterPageWithLayout(AdminRegenerateCertificates)
const ImportCandidatesPage = makePresenterPageWithLayout(ImportCandidates)
const ListProjectsPage = makePresenterPage(ListProjects)
const InvitationListPage = makePresenterPageWithLayout(InvitationList)
const NotificationListPage = makePresenterPageWithLayout(NotificationList)
const SuccessOrErrorPage = makePresenterPage(SuccessOrError)
const AdminAppelOffrePage = makePresenterPageWithLayout(AdminAppelOffre)
const ListMissingOwnerProjectsPage = makePresenterPage(ListMissingOwnerProjects)
const InvitationsAreDeprecatedPage = makePresenterPageWithLayout(InvitationsAreDeprecated)
const FakeLoginPage = makePresenterPageWithLayout(FakeLogin)

export {
  ImportCandidatesPage,
  ListProjectsPage,
  AdminNotifyCandidatesPage,
  InvitationListPage,
  NotificationListPage,
  SuccessOrErrorPage as SuccessPage,
  AdminAppelOffrePage,
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
function makePresenterPageWithLayout<T extends HasRequest>(
  pageComponent: (pageProps: T) => JSX.Element
) {
  return (props: T): string =>
    makeHtml({ Component: PageLayout(pageComponent), props, hydrate: false })
}

/**
 * Turn a Page Component (pure) into a presenter that returns a full HTML page
 * @param pageComponent
 */
/* global JSX */
function makePresenterPage<T extends HasRequest>(pageComponent: (pageProps: T) => JSX.Element) {
  return (props: T): string => makeHtml({ Component: pageComponent, props, hydrate: false })
}
