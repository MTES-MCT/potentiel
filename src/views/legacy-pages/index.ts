import { Request } from 'express'
import { makeHtml } from '../index.html'
import InvitationList from './invitationList'
import NotificationList from './notificationList'
import InvitationsAreDeprecated from './invitationsAreDeprecated'
import SuccessOrError from './successOrError'
import ListMissingOwnerProjects from './listMissingOwnerProjects'
import FakeLogin from './fakeLogin'

const InvitationListPage = makePresenterPage(InvitationList)
const NotificationListPage = makePresenterPage(NotificationList)
const SuccessOrErrorPage = makePresenterPage(SuccessOrError)
const ListMissingOwnerProjectsPage = makePresenterPage(ListMissingOwnerProjects)
const InvitationsAreDeprecatedPage = makePresenterPage(InvitationsAreDeprecated)
const FakeLoginPage = makePresenterPage(FakeLogin)

export {
  InvitationListPage,
  NotificationListPage,
  SuccessOrErrorPage as SuccessPage,
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
  return (props: T): string => makeHtml({ Component: pageComponent, props, hydrate: false })
}
