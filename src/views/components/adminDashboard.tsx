import React from 'react'
import ROUTES from '../../routes'
import { User } from '../../entities'

interface SeparatorItemProps {
  visibleForRoles: Array<User['role']>
  role: User['role'] | undefined
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

interface AdminDashboardProps {
  children: React.ReactNode
  role: User['role'] | undefined
  currentPage:
    | 'list-projects'
    | 'import-projects'
    | 'list-requests'
    | 'notify-candidates'
    | 'list-dreal'
    | 'list-garanties-financieres'
    | 'list-invitations'
    | 'list-notifications'
    | undefined
}

interface MenuItemProps {
  route: string
  currentPage: AdminDashboardProps['currentPage']
  itemPage: AdminDashboardProps['currentPage']
  title: string
  visibleForRoles: Array<User['role']>
  role: User['role'] | undefined
}
const MenuItem = ({
  route,
  title,
  currentPage,
  itemPage,
  visibleForRoles,
  role,
}: MenuItemProps) =>
  role && visibleForRoles.includes(role) ? (
    <li>
      <a href={route} className={currentPage === itemPage ? 'active' : ''}>
        {title}
      </a>
    </li>
  ) : null

/* Pure component */
export default function AdminDashboard({
  children,
  currentPage,
  role,
}: AdminDashboardProps) {
  return (
    <>
      <section className="section section-color" style={{ padding: '1em 0' }}>
        <div className="container">
          <h2 className="section__title" style={{ marginBottom: 0 }}>
            Portail Administrateur {role === 'dreal' ? 'DREAL' : 'DGEC'}
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

            <MenuItem
              route={ROUTES.ADMIN_LIST_PROJECTS}
              itemPage={'list-projects'}
              title="Projets"
              visibleForRoles={['admin', 'dreal']}
              role={role}
              currentPage={currentPage}
            />
            <MenuItem
              route={ROUTES.ADMIN_LIST_REQUESTS}
              itemPage={'list-requests'}
              title="Demandes"
              visibleForRoles={['admin']}
              role={role}
              currentPage={currentPage}
            />
            <MenuItem
              route={ROUTES.GARANTIES_FINANCIERES_LIST}
              itemPage={'list-garanties-financieres'}
              title="Garanties Financières"
              visibleForRoles={['admin', 'dreal']}
              role={role}
              currentPage={currentPage}
            />

            <SeparatorItem visibleForRoles={['admin']} role={role} />

            <MenuItem
              route={ROUTES.IMPORT_PROJECTS}
              itemPage={'import-projects'}
              title="Importer des candidats"
              visibleForRoles={['admin']}
              role={role}
              currentPage={currentPage}
            />

            <MenuItem
              route={ROUTES.ADMIN_NOTIFY_CANDIDATES()}
              itemPage={'notify-candidates'}
              title="Notifier des candidats"
              visibleForRoles={['admin']}
              role={role}
              currentPage={currentPage}
            />
            <MenuItem
              route={ROUTES.ADMIN_INVITATION_LIST}
              itemPage={'list-invitations'}
              title="Invitations candidats en attente"
              visibleForRoles={['admin']}
              role={role}
              currentPage={currentPage}
            />
            <MenuItem
              route={ROUTES.ADMIN_NOTIFICATION_LIST}
              itemPage={'list-notifications'}
              title="Emails en erreur"
              visibleForRoles={['admin']}
              role={role}
              currentPage={currentPage}
            />

            <SeparatorItem visibleForRoles={['admin']} role={role} />

            <MenuItem
              route={ROUTES.ADMIN_DREAL_LIST}
              itemPage={'list-dreal'}
              title="Gérer les DREAL"
              visibleForRoles={['admin']}
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
