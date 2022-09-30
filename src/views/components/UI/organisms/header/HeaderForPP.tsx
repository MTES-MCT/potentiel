import React, { FC } from 'react'
import type { Request } from 'express'
import { Header } from '../../../Header'
import routes from '@routes'

type HeaderForPPProps = {
  user: Request['user'] & { role: 'porteur-projet' }
  currentPage?: string
}

export const HeaderForPP: FC<HeaderForPPProps> = ({ user, currentPage }) => (
  <Header {...user}>
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
  </Header>
)
