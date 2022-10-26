import React from 'react'
import type { Request } from 'express'
import routes from '@routes'
import { Footer } from './Footer'
import { Header } from './Header'
import { DropdownMenu } from './UI/molecules/DropdownMenu'

type CurrentPage =
  | 'list-projects'
  | 'list-requests'
  | 'list-garanties-financieres'
  | 'list-missing-owner-projects'
  | 'ademe-statistiques'
  | 'import-projects'
  | 'notify-candidates'
  | 'list-invitations'
  | 'list-notifications'
  | 'admin-upload-legacy-modification-files'
  | 'import-gestionnaire-réseau'
  | 'list-dreal'
  | 'regenerate-certificates'
  | 'admin-ao'
  | 'admin-users'
  | 'admin-statistiques'
  | undefined

const getUserNavigation = ({
  user,
  currentPage,
}: {
  user: Request['user']
  currentPage?: CurrentPage
}) => {
  switch (user.role) {
    case 'porteur-projet':
      return MenuPorteurProjet(currentPage)
    case 'acheteur-obligé':
      return MenuAcheteurObligé(currentPage)
    case 'ademe':
      return MenuAdeme(currentPage)
    case 'dreal':
      return MenuDreal(currentPage)
    case 'admin':
      return MenuAdmin(currentPage)
    case 'dgec-validateur':
      return MenuAdmin(currentPage)
  }

  return null
}

const MenuAdmin = (currentPage: CurrentPage) => (
  <>
    <Header.MenuItem
      href={routes.ADMIN_LIST_PROJECTS}
      {...(currentPage === 'list-projects' && { isCurrent: true })}
    >
      Projets
    </Header.MenuItem>
    <Header.MenuItem
      href={routes.ADMIN_LIST_REQUESTS}
      {...(currentPage === 'list-requests' && { isCurrent: true })}
    >
      Demandes
    </Header.MenuItem>
    <DropdownMenu buttonChildren={'Candidats'}>
      <DropdownMenu.DropdownItem
        href={routes.IMPORT_PROJECTS}
        {...(currentPage === 'import-projects' && { isCurrent: true })}
      >
        Importer des candidats
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={routes.ADMIN_NOTIFY_CANDIDATES()}
        {...(currentPage === 'notify-candidates' && { isCurrent: true })}
      >
        Notifier des candidats
      </DropdownMenu.DropdownItem>

      <DropdownMenu.DropdownItem
        href={routes.ADMIN_INVITATION_LIST}
        {...(currentPage === 'list-invitations' && { isCurrent: true })}
      >
        Invitations de candidats en attente
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={routes.ADMIN_NOTIFICATION_LIST}
        {...(currentPage === 'list-notifications' && { isCurrent: true })}
      >
        Emails en erreur
      </DropdownMenu.DropdownItem>
    </DropdownMenu>
    <DropdownMenu buttonChildren={'Gestion'}>
      <DropdownMenu.DropdownItem
        href={routes.ADMIN_REGENERATE_CERTIFICATES}
        {...(currentPage === 'regenerate-certificates' && { isCurrent: true })}
      >
        Regénérer des attestations
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={routes.ADMIN_AO_PERIODE}
        {...(currentPage === 'admin-ao' && { isCurrent: true })}
      >
        Gérer les appels d'offres
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={routes.ADMIN_DREAL_LIST}
        {...(currentPage === 'list-dreal' && { isCurrent: true })}
      >
        Gérer les DREAL
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={routes.ADMIN_PARTNER_USERS}
        {...(currentPage === 'admin-users' && { isCurrent: true })}
      >
        Gérer les utilisateurs partenaires
      </DropdownMenu.DropdownItem>
      <DropdownMenu.DropdownItem
        href={routes.UPLOAD_LEGACY_MODIFICATION_FILES}
        {...(currentPage === 'admin-upload-legacy-modification-files' && { isCurrent: true })}
      >
        Importer des courriers historiques
      </DropdownMenu.DropdownItem>
      {!!process.env.ENABLE_IMPORT_GESTIONNAIRE_RESEAU && (
        <DropdownMenu.DropdownItem
          href={routes.IMPORT_GESTIONNAIRE_RESEAU}
          {...(currentPage === 'import-gestionnaire-réseau' && { isCurrent: true })}
        >
          Import gestionnaire réseau
        </DropdownMenu.DropdownItem>
      )}
    </DropdownMenu>
    <Header.MenuItem
      href={routes.ADMIN_STATISTIQUES}
      {...(currentPage === 'admin-statistiques' && { isCurrent: true })}
    >
      Tableau de bord
    </Header.MenuItem>
  </>
)

const MenuPorteurProjet = (currentPage: CurrentPage) => (
  <>
    <Header.MenuItem
      href={routes.USER_LIST_PROJECTS}
      {...(currentPage === 'list-projects' && { isCurrent: true })}
    >
      Mes projets
    </Header.MenuItem>
    <Header.MenuItem
      href={routes.USER_LIST_REQUESTS}
      {...(currentPage === 'list-requests' && { isCurrent: true })}
    >
      Mes demandes
    </Header.MenuItem>
    <Header.MenuItem
      href={routes.USER_LIST_MISSING_OWNER_PROJECTS}
      {...(currentPage === 'list-missing-owner-projects' && { isCurrent: true })}
    >
      Projets à réclamer
    </Header.MenuItem>
  </>
)

const MenuAcheteurObligé = (currentPage: CurrentPage) => (
  <>
    <Header.MenuItem
      href={routes.USER_LIST_PROJECTS}
      {...(currentPage === 'list-projects' && { isCurrent: true })}
    >
      Projets
    </Header.MenuItem>
    <Header.MenuItem
      href={routes.ADMIN_LIST_REQUESTS}
      {...(currentPage === 'list-requests' && { isCurrent: true })}
    >
      Demandes
    </Header.MenuItem>
  </>
)

const MenuAdeme = (currentPage: CurrentPage) => (
  <>
    <Header.MenuItem
      href={routes.USER_LIST_PROJECTS}
      {...(currentPage === 'list-projects' && { isCurrent: true })}
    >
      Projets
    </Header.MenuItem>
    <Header.MenuItem
      href={routes.ADEME_STATISTIQUES}
      {...(currentPage === 'ademe-statistiques' && { isCurrent: true })}
    >
      Tableau de bord
    </Header.MenuItem>
  </>
)

const MenuDreal = (currentPage: CurrentPage) => (
  <>
    <Header.MenuItem
      href={routes.ADMIN_LIST_PROJECTS}
      {...(currentPage === 'list-projects' && { isCurrent: true })}
    >
      Projets
    </Header.MenuItem>
    <Header.MenuItem
      href={routes.ADMIN_LIST_REQUESTS}
      {...(currentPage === 'list-requests' && { isCurrent: true })}
    >
      Demandes
    </Header.MenuItem>
    <Header.MenuItem
      href={routes.ADMIN_GARANTIES_FINANCIERES}
      {...(currentPage === 'list-garanties-financieres' && { isCurrent: true })}
    >
      Garanties Financières
    </Header.MenuItem>
  </>
)

export const PageTemplate = ({
  user,
  children,
  currentPage,
}: {
  user: Request['user']
  children: React.ReactNode
  currentPage?: CurrentPage
}) => {
  return (
    <>
      <Header user={user}>{user && getUserNavigation({ user, currentPage })}</Header>
      <main
        role="main"
        className="flex flex-col py-6 xl:pt-12 xl:mx-auto xl:max-w-7xl"
        style={{ fontFamily: 'Marianne, arial, sans-serif' }}
      >
        {children}
      </main>
      <Footer />
    </>
  )
}
