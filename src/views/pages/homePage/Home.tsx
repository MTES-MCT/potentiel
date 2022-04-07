import type { Request } from 'express'
import React from 'react'
import { RiAccountCircleLine } from '@react-icons/all-files/ri/RiAccountCircleLine'
import { RiArrowRightCircleLine } from '@react-icons/all-files/ri/RiArrowRightCircleLine'
import { RiDashboardLine } from '@react-icons/all-files/ri/RiDashboardLine'
import { RiLogoutBoxLine } from '@react-icons/all-files/ri/RiLogoutBoxLine'
import routes from '../../../routes'
import { Header, Footer } from '../../components'
import { hydrateOnClient } from '../../helpers/hydrateOnClient'
import { LinkButton } from '../../components/buttons'

type Props = {
  request: Request
}

export const Home = (props: Props) => {
  const {
    request: { user },
  } = props

  return (
    <>
      <Header {...props}>
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
        <section className="bg-blue-france-sun-base text-white">
          <Container className="flex flex-col p-6 gap-6 xl:py-10">
            <div className="flex flex-col md:flex-row gap-6">
              <p className="m-0 text-3xl lg:text-5xl xl:text-6xl font-semibold">
                Suivez efficacement vos projets EnR*, transmettez vos documents, demandez des
                modifications.
                <br />
                <span className="text-sm lg:text-base font-light">*Énergies renouvelables</span>
              </p>
              <img
                className="object-scale-down w-full md:w-1/2"
                src="/images/home/proposition_valeur.png"
              />
            </div>
            <p className="text-lg md:text-base lg:text-xl font-medium md:font-semibold md:text-center md:m-0 md:mt-10 md:mb-0 lg:px-16 lg:leading-loose">
              Potentiel est le service du Ministère de la Transition Écologique qui connecte
              <br className="hidden md:inline" /> les acteurs du parcours administratif des projets
              d'EnR soumis à appel d'offres en France
            </p>
          </Container>
        </section>

        <section>
          <Container className="flex p-6 md:p-12">
            {user ? (
              <div className="flex flex-col items-center md:mx-auto">
                <p className="mt-0 text-2xl lg:text-3xl font-semibold">
                  Bonjour {user.fullName}, nous sommes ravis de vous revoir.
                </p>
                <div className="flex flex-col md:flex-row w-full md:w-fit gap-3">
                  <LinkButton
                    className="lg:text-lg"
                    href={routes.REDIRECT_BASED_ON_ROLE}
                    primary={true}
                  >
                    <RiDashboardLine className="mr-4" />
                    Voir {user.role === 'porteur-projet' ? 'mes' : 'les'} projets
                  </LinkButton>
                  <LinkButton className="lg:text-lg" href={routes.LOGOUT_ACTION}>
                    <RiLogoutBoxLine className="mr-4" />
                    Me déconnecter
                  </LinkButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row w-full md:w-fit md:mx-auto">
                <LinkButton href={routes.LOGIN} primary={true}>
                  <RiAccountCircleLine className="mr-4" />
                  Je m'identifie
                </LinkButton>
              </div>
            )}
          </Container>
        </section>
      </main>

      <Footer />
    </>
  )
}

type ContainerProps = {
  className?: string
  children?: React.ReactNode
}
const Container = ({ className, children }: ContainerProps) => (
  <div className={`flex xl:mx-auto xl:max-w-7xl ${className}`}>{children}</div>
)

hydrateOnClient(Home)
