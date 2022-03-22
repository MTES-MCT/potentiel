import React from 'react'
import { UserRole } from '@modules/users'
import ROUTES from '../../routes'

interface SeparatorItemProps {
  visibleForRoles: Array<UserRole>
  role: UserRole | undefined
}
const SeparatorItem = ({ visibleForRoles, role }: SeparatorItemProps) =>
  role && visibleForRoles.includes(role) ? (
    <div
      style={{
        height: 3,
        width: '100%',
        backgroundColor: 'var(--lighter-grey)',
        margin: '5px 0px',
      }}
    />
  ) : null

interface PartnerDashboardProps {
  children: React.ReactNode
  role: UserRole | undefined
  currentPage: 'list-projects' | 'ademe-statistiques' | undefined
}

interface MenuItemProps {
  route: string
  currentPage: PartnerDashboardProps['currentPage']
  itemPage: PartnerDashboardProps['currentPage']
  title: string
  visibleForRoles: Array<UserRole>
  role: UserRole | undefined
}
const MenuItem = ({ route, title, currentPage, itemPage, visibleForRoles, role }: MenuItemProps) =>
  role && visibleForRoles.includes(role) ? (
    <li>
      <a href={route} className={currentPage === itemPage ? 'active' : ''}>
        {title}
      </a>
    </li>
  ) : null

/* Pure component */
export default function PartnerDashboard({ children, currentPage, role }: PartnerDashboardProps) {
  return (
    <>
      <section className="section section-color" style={{ padding: '1em 0' }}>
        <div className="container">
          <h2 className="section__title" style={{ marginBottom: 0 }}>
            Portail {role === 'acheteur-obligé' ? 'Acheteur Obligé' : 'Partenaire'}
          </h2>
        </div>
      </section>
      <div className="dashboard">
        <aside className="side-menu" role="navigation">
          <ul>
            {typeof currentPage === 'undefined' && (
              <li>
                <a className="active" style={{ fontSize: '2px', cursor: 'default' }}></a>
              </li>
            )}

            <MenuItem
              route={ROUTES.USER_LIST_PROJECTS}
              itemPage={'list-projects'}
              title="Projets"
              visibleForRoles={['acheteur-obligé', 'ademe']}
              role={role}
              currentPage={currentPage}
            />

            <MenuItem
              route={ROUTES.ADEME_STATISTIQUES}
              itemPage={'ademe-statistiques'}
              title="Ademe statistiques"
              visibleForRoles={['ademe']}
              role={role}
              currentPage={currentPage}
            />
          </ul>
        </aside>
        <div className="main">{children}</div>
      </div>
    </>
  )
}
