import React from 'react'
import type { Request } from 'express'
import routes from '@routes'
import { Footer } from './Footer'
import { Header } from './Header'
import { userIs } from '@modules/users'

type CurrentPage =
  | 'list-projects'
  | 'list-requests'
  | 'list-garanties-financieres'
  | 'list-missing-owner-projects'
  | 'ademe-statistiques'
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
  }

  return null
}
const MenuPorteurProjet = (currentPage: CurrentPage) => [
  <Header.MenuItem
    key="main-menu-1"
    href={routes.USER_LIST_PROJECTS}
    {...(currentPage === 'list-projects' && { isCurrent: true })}
  >
    Mes projets
  </Header.MenuItem>,
  <Header.MenuItem
    key="main-menu-2"
    href={routes.USER_LIST_REQUESTS}
    {...(currentPage === 'list-requests' && { isCurrent: true })}
  >
    Mes demandes
  </Header.MenuItem>,
  <Header.MenuItem
    key="main-menu-3"
    href={routes.USER_LIST_MISSING_OWNER_PROJECTS}
    {...(currentPage === 'list-missing-owner-projects' && { isCurrent: true })}
  >
    Projets à réclamer
  </Header.MenuItem>,
]

const MenuAcheteurObligé = (currentPage: CurrentPage) => [
  <Header.MenuItem
    key="main-menu-1"
    href={routes.USER_LIST_PROJECTS}
    {...(currentPage === 'list-projects' && { isCurrent: true })}
  >
    Projets
  </Header.MenuItem>,
  <Header.MenuItem
    key="main-menu-2"
    href={routes.ADMIN_LIST_REQUESTS}
    {...(currentPage === 'list-requests' && { isCurrent: true })}
  >
    Demandes
  </Header.MenuItem>,
]

const MenuAdeme = (currentPage: CurrentPage) => [
  <Header.MenuItem
    key="main-menu-1"
    href={routes.USER_LIST_PROJECTS}
    {...(currentPage === 'list-projects' && { isCurrent: true })}
  >
    Projets
  </Header.MenuItem>,
  <Header.MenuItem
    key="main-menu-2"
    href={routes.ADEME_STATISTIQUES}
    {...(currentPage === 'ademe-statistiques' && { isCurrent: true })}
  >
    Tableau de bord
  </Header.MenuItem>,
]

const MenuDreal = (currentPage: CurrentPage) => [
  <Header.MenuItem
    key="main-menu-1"
    href={routes.ADMIN_LIST_PROJECTS}
    {...(currentPage === 'list-projects' && { isCurrent: true })}
  >
    Projets
  </Header.MenuItem>,
  <Header.MenuItem
    key="main-menu-2"
    href={routes.ADMIN_LIST_REQUESTS}
    {...(currentPage === 'list-requests' && { isCurrent: true })}
  >
    Demandes
  </Header.MenuItem>,
  <Header.MenuItem
    key="main-menu-3"
    href={routes.ADMIN_GARANTIES_FINANCIERES}
    {...(currentPage === 'list-garanties-financieres' && { isCurrent: true })}
  >
    Garanties Financières
  </Header.MenuItem>,
]

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

      {user && userIs(['acheteur-obligé', 'ademe', 'porteur-projet', 'dreal'])(user) ? (
        <main
          role="main"
          className="flex flex-col py-6 xl:pt-12 xl:mx-auto xl:max-w-7xl"
          style={{ fontFamily: 'Marianne, arial, sans-serif' }}
        >
          {children}
        </main>
      ) : (
        children
      )}

      <Footer />
    </>
  )
}
