import React from 'react'
import ROUTES from '@routes'
import { UserRole } from '@modules/users'

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

interface AdminDashboardProps {
  children: React.ReactNode
  role: UserRole | undefined
  currentPage:
    | 'list-projects'
    | 'import-projects'
    | 'list-requests'
    | 'notify-candidates'
    | 'list-dreal'
    | 'list-garanties-financieres'
    | 'list-invitations'
    | 'list-notifications'
    | 'regenerate-certificates'
    | 'admin-ao'
    | 'admin-users'
    | 'admin-statistiques'
    | 'admin-upload-legacy-modification-files'
    | 'import-enedis'
    | undefined
}

interface MenuItemProps {
  route: string
  currentPage: AdminDashboardProps['currentPage']
  itemPage: AdminDashboardProps['currentPage']
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
export function AdminDashboard({ children, currentPage, role }: AdminDashboardProps) {
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
            {typeof currentPage === 'undefined' && (
              <li>
                <a className="active" style={{ fontSize: '2px', cursor: 'default' }}></a>
              </li>
            )}

            <MenuItem
              route={ROUTES.ADMIN_LIST_PROJECTS}
              itemPage={'list-projects'}
              title="Projets"
              visibleForRoles={['admin', 'dreal', 'dgec-validateur']}
              role={role}
              currentPage={currentPage}
            />
            <MenuItem
              route={ROUTES.ADMIN_LIST_REQUESTS}
              itemPage={'list-requests'}
              title="Demandes"
              visibleForRoles={['admin', 'dreal', 'dgec-validateur']}
              role={role}
              currentPage={currentPage}
            />
            <MenuItem
              route={`${ROUTES.ADMIN_GARANTIES_FINANCIERES}?garantiesFinancieres=submitted`}
              itemPage={'list-garanties-financieres'}
              title="Garanties Financières"
              visibleForRoles={['dreal']}
              role={role}
              currentPage={currentPage}
            />

            <SeparatorItem visibleForRoles={['admin', 'dgec-validateur']} role={role} />

            <MenuItem
              route={ROUTES.IMPORT_PROJECTS}
              itemPage={'import-projects'}
              title="Importer des candidats"
              visibleForRoles={['admin', 'dgec-validateur']}
              role={role}
              currentPage={currentPage}
            />

            <MenuItem
              route={ROUTES.ADMIN_NOTIFY_CANDIDATES()}
              itemPage={'notify-candidates'}
              title="Notifier des candidats"
              visibleForRoles={['admin', 'dgec-validateur']}
              role={role}
              currentPage={currentPage}
            />
            <MenuItem
              route={ROUTES.ADMIN_INVITATION_LIST}
              itemPage={'list-invitations'}
              title="Invitations candidats en attente"
              visibleForRoles={['admin', 'dgec-validateur']}
              role={role}
              currentPage={currentPage}
            />
            <MenuItem
              route={ROUTES.ADMIN_NOTIFICATION_LIST}
              itemPage={'list-notifications'}
              title="Emails en erreur"
              visibleForRoles={['admin', 'dgec-validateur']}
              role={role}
              currentPage={currentPage}
            />
            <SeparatorItem visibleForRoles={['admin', 'dgec-validateur']} role={role} />

            <MenuItem
              route={ROUTES.UPLOAD_LEGACY_MODIFICATION_FILES}
              itemPage={'admin-upload-legacy-modification-files'}
              title="Importer des courriers historiques"
              visibleForRoles={['admin']}
              role={role}
              currentPage={currentPage}
            />

            <SeparatorItem visibleForRoles={['admin', 'dgec-validateur']} role={role} />
            {/* {!!process.env.ENABLE_ENEDIS_IMPORT && (
              <>
              <MenuItem
                route={ROUTES.IMPORTER_LISTING_ENEDIS}
                itemPage={'import-enedis'}
                title="Importer des données Enedis"
                visibleForRoles={['admin', 'dgec-validateur']}
                role={role}
                currentPage={currentPage}
              />
              <SeparatorItem visibleForRoles={['admin', 'dgec-validateur']} role={role} />
              </>
            )} */}

            <MenuItem
              route={ROUTES.ADMIN_DREAL_LIST}
              itemPage={'list-dreal'}
              title="Gérer les DREAL"
              visibleForRoles={['admin', 'dgec-validateur']}
              role={role}
              currentPage={currentPage}
            />

            <MenuItem
              route={ROUTES.ADMIN_REGENERATE_CERTIFICATES}
              itemPage={'regenerate-certificates'}
              title="Regénérer des attestations"
              visibleForRoles={['admin', 'dgec-validateur']}
              role={role}
              currentPage={currentPage}
            />

            <MenuItem
              route={ROUTES.ADMIN_AO_PERIODE}
              itemPage={'admin-ao'}
              title="Gérer les appels d'offre"
              visibleForRoles={['admin', 'dgec-validateur']}
              role={role}
              currentPage={currentPage}
            />

            <MenuItem
              route={ROUTES.ADMIN_PARTNER_USERS}
              itemPage={'admin-users'}
              title="Gérer les utilisateurs partenaires"
              visibleForRoles={['admin', 'dgec-validateur']}
              role={role}
              currentPage={currentPage}
            />
            <SeparatorItem visibleForRoles={['admin', 'dgec-validateur']} role={role} />

            <MenuItem
              route={ROUTES.ADMIN_STATISTIQUES}
              itemPage={'admin-statistiques'}
              title="Tableau de bord"
              visibleForRoles={['admin', 'dgec-validateur']}
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
