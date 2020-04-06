import React from 'react'
import ROUTES from '../../routes'

interface AdminDashboardProps {
  children: React.ReactNode
  currentPage:
    | 'list-projects'
    | 'import-projects'
    | 'list-requests'
    | 'notify-candidates'
    | undefined
}

/* Pure component */
export default function AdminDashboard({
  children,
  currentPage
}: AdminDashboardProps) {
  return (
    <>
      <section className="section section-color" style={{ padding: '1em 0' }}>
        <div className="container">
          <h2 className="section__title" style={{ marginBottom: 0 }}>
            Portail Administrateur
          </h2>
        </div>
      </section>
      <div className="dashboard">
        <aside className="side-menu" role="navigation">
          <ul>
            {typeof currentPage === 'undefined' ? (
              <li>
                <a
                  className="active"
                  style={{ fontSize: '2px', cursor: 'default' }}
                ></a>
              </li>
            ) : (
              ''
            )}

            <li>
              <a
                href={ROUTES.IMPORT_PROJECTS}
                className={currentPage === 'import-projects' ? 'active' : ''}
              >
                Importer des candidats
              </a>
            </li>
            <li>
              <a
                href={ROUTES.ADMIN_NOTIFY_CANDIDATES()}
                className={currentPage === 'notify-candidates' ? 'active' : ''}
              >
                Notifier des candidats
              </a>
            </li>
            <li>
              <a
                href={ROUTES.ADMIN_LIST_PROJECTS}
                className={currentPage === 'list-projects' ? 'active' : ''}
              >
                Lister les projets
              </a>
            </li>
            <li>
              <a
                href={ROUTES.ADMIN_LIST_REQUESTS}
                className={currentPage === 'list-requests' ? 'active' : ''}
              >
                Lister les demandes
              </a>
            </li>
          </ul>
        </aside>
        <div className="main">{children}</div>
      </div>
    </>
  )
}
