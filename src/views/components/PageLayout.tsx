import React from 'react'
import type { Request } from 'express'
import routes from '@routes'
import { Footer } from './Footer'
import { Header } from './Header'
import { userIs } from '@modules/users'

const getUserNavigation = (user: Request['user']) => {
  switch (user.role) {
    case 'porteur-projet':
      return MenuPorteurProjet('')
    case 'acheteur-obligé':
      return MenuAcheteurObligé('')
    case 'ademe':
      return MenuAdeme('')
    case 'dreal':
      return MenuDreal('')
  }

  return null
}
const MenuPorteurProjet = (currentPage: string) => [
  <Header.MenuItem
    href={routes.USER_LIST_PROJECTS}
    {...(currentPage === 'list-projects' && { isCurrent: true })}
  >
    Mes projets
  </Header.MenuItem>,
  <Header.MenuItem
    href={routes.USER_LIST_REQUESTS}
    {...(currentPage === 'list-requests' && { isCurrent: true })}
  >
    Mes demandes
  </Header.MenuItem>,
  <Header.MenuItem
    href={routes.USER_LIST_MISSING_OWNER_PROJECTS}
    {...(currentPage === 'list-missing-owner-projects' && { isCurrent: true })}
  >
    Projets à réclamer
  </Header.MenuItem>,
]

const MenuAcheteurObligé = (currentPage: string) => [
  <Header.MenuItem
    href={routes.USER_LIST_PROJECTS}
    {...(currentPage === 'list-projects' && { isCurrent: true })}
  >
    Projets
  </Header.MenuItem>,
]

const MenuAdeme = (currentPage: string) => [
  <Header.MenuItem
    href={routes.USER_LIST_PROJECTS}
    {...(currentPage === 'list-projects' && { isCurrent: true })}
  >
    Projets
  </Header.MenuItem>,
  <Header.MenuItem
    href={routes.ADEME_STATISTIQUES}
    {...(currentPage === 'ademe-statistiques' && { isCurrent: true })}
  >
    Tableau de bord
  </Header.MenuItem>,
]

const MenuDreal = (currentPage: string) => [
  <Header.MenuItem
    href={routes.ADMIN_LIST_PROJECTS}
    {...(currentPage === 'list-projects' && { isCurrent: true })}
  >
    Projets
  </Header.MenuItem>,
  <Header.MenuItem
    href={routes.ADMIN_LIST_REQUESTS}
    {...(currentPage === 'list-requests' && { isCurrent: true })}
  >
    Demandes
  </Header.MenuItem>,
  <Header.MenuItem
    href={routes.ADMIN_GARANTIES_FINANCIERES}
    {...(currentPage === 'list-garanties-financieres' && { isCurrent: true })}
  >
    Garanties Financières
  </Header.MenuItem>,
]

interface HasRequest {
  request: Request
}

export const PageLayout =
  <T extends HasRequest>(Component: (props: T) => JSX.Element) =>
  (props: T) => {
    const {
      request: { user },
    } = props
    return (
      <>
        <Header {...{ user: props.request.user }}>{user && getUserNavigation(user)}</Header>

        {user && userIs(['acheteur-obligé', 'ademe', 'porteur-projet', 'dreal'])(user) ? (
          <main
            role="main"
            className="flex flex-col py-6 xl:pt-12 xl:mx-auto xl:max-w-7xl"
            style={{ fontFamily: 'Marianne, arial, sans-serif' }}
          >
            <Component {...props} />
          </main>
        ) : (
          <Component {...props} />
        )}

        <Footer />
      </>
    )
  }
