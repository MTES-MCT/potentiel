import { Request } from 'express'
import { makeHtml } from '../index.html'
import NotificationList from './notificationList'
import InvitationsAreDeprecated from './invitationsAreDeprecated'
import ListMissingOwnerProjects from './listMissingOwnerProjects'

const NotificationListPage = makePresenterPage(NotificationList)
const ListMissingOwnerProjectsPage = makePresenterPage(ListMissingOwnerProjects)
const InvitationsAreDeprecatedPage = makePresenterPage(InvitationsAreDeprecated)

export { NotificationListPage, ListMissingOwnerProjectsPage, InvitationsAreDeprecatedPage }

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
