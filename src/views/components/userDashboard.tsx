import React from 'react'
import ROUTES from '../../routes'

interface UserDashboardProps {
  children: React.ReactNode
  currentPage: 'list-projects' | undefined
}

/* Pure component */
export default function UserDashboard({
  children,
  currentPage
}: UserDashboardProps) {
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
                href={ROUTES.USER_LIST_PROJECTS}
                className={currentPage === 'list-projects' ? 'active' : ''}
              >
                Mes projets
              </a>
            </li>
          </ul>
        </aside>
        <div className="main">{children}</div>
      </div>
    </>
  )
}
