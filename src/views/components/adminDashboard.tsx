import React from 'react'
import ROUTES from '../../routes'

interface AdminDashboardProps {
  children: React.ReactNode
  currentPage: 'list-projects' | 'import-projects' | 'list-requests' | undefined
}

/* Pure component */
export default function AdminDashboard({
  children,
  currentPage
}: AdminDashboardProps) {
  return (
    <>
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
            <li>
              <a
                href={ROUTES.IMPORT_PROJECTS}
                className={currentPage === 'import-projects' ? 'active' : ''}
              >
                Importer des candidats
              </a>
            </li>
          </ul>
        </aside>
        <div className="main">{children}</div>
      </div>
    </>
  )
}
