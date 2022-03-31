import type { Request } from 'express'
import React from 'react'
import { RiAccountCircleLine, RiDashboardLine, RiLogoutBoxLine } from 'react-icons/ri'
import routes from '../../../routes'
import { PageLayout } from '../../components/PageLayout'
import { hydrateOnClient } from '../../helpers/hydrateOnClient'

type Props = {
  request: Request
}

export const Home = PageLayout(function ({ request: { user } }: Props) {
  return (
    <>
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
                <p className="m-0 text-2xl lg:text-3xl font-semibold">
                  Bonjour, nous sommes ravis de vous revoir
                </p>
                <p>Vous êtes connecté-e en tant que {user.fullName}</p>
                <div className="flex flex-col md:flex-row w-full md:w-fit gap-3">
                  <LinkButton href={routes.REDIRECT_BASED_ON_ROLE} primary={true}>
                    <RiDashboardLine className="mr-4" />
                    Voir {user.role === 'porteur-projet' ? 'mes' : 'les'} projets
                  </LinkButton>
                  <LinkButton href={routes.REDIRECT_BASED_ON_ROLE}>
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
    </>
  )
})

type ContainerProps = {
  className?: string
  children?: React.ReactNode
}
const Container = ({ className, children }: ContainerProps) => (
  <div className={`flex xl:mx-auto xl:max-w-7xl ${className}`}>{children}</div>
)

type LinkButtonProps = {
  href: string
  className?: string
  children?: React.ReactNode
  primary?: true
}
const LinkButton = ({ href, className, children, primary }: LinkButtonProps) => (
  <a
    className={`no-underline inline-flex items-center px-6 py-3 border border-solid text-base lg:text-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      primary
        ? 'border-transparent text-white bg-blue-france-sun-base hover:bg-blue-france-sun-hover focus:bg-blue-france-sun-active'
        : 'border-blue-france-sun-base text-blue-france-sun-base bg-white hover:bg-white focus:bg-white'
    } ${className}`}
    style={{ color: primary ? 'white' : '#000091', textDecoration: 'none' }}
    href={href}
  >
    {children}
  </a>
)

hydrateOnClient(Home)
