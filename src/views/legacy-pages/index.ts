import { Request } from 'express'
import { makeHtml } from '../index.html'
import InvitationsAreDeprecated from './invitationsAreDeprecated'

const InvitationsAreDeprecatedPage = makePresenterPage(InvitationsAreDeprecated)

export { InvitationsAreDeprecatedPage }

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
