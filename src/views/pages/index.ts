import * as fs from 'fs'
import * as path from 'path'

import * as ReactDOMServer from 'react-dom/server'

import Header from '../components/header'

import AdminLogin from './adminLogin'
import AdminDashboard from './adminDashboard'

const AdminLoginPage = makePresenterPage(AdminLogin)
const AdminDashboardPage = makePresenterPage(AdminDashboard)

export { AdminLoginPage, AdminDashboardPage }

/**
 * Turn a Page Component (pure) into a presenter that returns a full HTML page
 * @param pageComponent
 */
function makePresenterPage(pageComponent) {
  return (props?: any) =>
    insertIntoHTMLTemplate(
      ReactDOMServer.renderToStaticMarkup(Header(props)) +
        ReactDOMServer.renderToStaticMarkup(pageComponent(props))
    )
}

const headerPartial = fs.readFileSync(
  path.resolve(__dirname, '../template/header.html.partial')
)
const footerPartial = fs.readFileSync(
  path.resolve(__dirname, '../template/footer.html.partial')
)

/**
 * Insert html contents into the full template
 * @param htmlContents
 */
function insertIntoHTMLTemplate(htmlContents: string): string {
  return headerPartial + htmlContents + footerPartial
}
