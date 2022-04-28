import type { Request } from 'express'
import React from 'react'
import { RiArrowRightCircleLine } from '@react-icons/all-files/ri/RiArrowRightCircleLine'
import routes from '../../../routes'
import { Header, Footer } from '../../components'
import { hydrateOnClient } from '../../helpers/hydrateOnClient'
import { InscriptionConnexion, Benefices, PropositionDeValeur } from './components'

type HomeProps = {
  request: Request
}

export const Home = (props: HomeProps) => {
  const {
    request: { user },
  } = props

  return (
    <>
      <Header {...{ user }}>
        {user && (
          <Header.MenuItem href={routes.REDIRECT_BASED_ON_ROLE}>
            <div className="flex flex-row items-center">
              Voir {user.role === 'porteur-projet' ? 'mes' : 'les'} projets
              <RiArrowRightCircleLine className="w-5 h-5 ml-2" />
            </div>
          </Header.MenuItem>
        )}
      </Header>

      <main role="main" style={{ fontFamily: 'Marianne, arial, sans-serif' }}>
        <PropositionDeValeur />
        <InscriptionConnexion {...{ user }} />
        <Benefices />
      </main>
      <Footer />
    </>
  )
}

hydrateOnClient(Home)
