import type { Request } from 'express'
import React, { useState } from 'react'
import { RiAccountCircleLine } from '@react-icons/all-files/ri/RiAccountCircleLine'
import { RiAccountPinBoxLine } from '@react-icons/all-files/ri/RiAccountPinBoxLine'
import { RiArrowRightCircleLine } from '@react-icons/all-files/ri/RiArrowRightCircleLine'
import { RiMailAddFill } from '@react-icons/all-files/ri/RiMailAddFill'
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
          <Container className="flex flex-col p-6 gap-6 xl:pt-10">
            <div className="flex flex-col md:flex-row">
              <h1
                className="m-0 text-3xl lg:text-4xl xl:text-5xl font-semibold lg:pt-10"
                style={{ fontFamily: 'Marianne, arial, sans-serif' }}
              >
                Suivez efficacement vos projets d'EnR* électriques, transmettez vos documents,
                demandez des modifications.
                <br />
                <span className="text-sm lg:text-base font-light">*Énergies renouvelables</span>
              </h1>
              <img
                className="object-scale-down w-full md:w-1/2"
                src="/images/home/proposition_valeur.png"
              />
            </div>
            <p className="text-lg md:text-base lg:text-xl font-medium md:font-semibold md:text-center md:m-0 md:mt-10 md:mb-0 lg:px-16 lg:leading-loose">
              Potentiel est le service du Ministère de la Transition Écologique qui connecte
              <br className="hidden md:inline" /> les acteurs du parcours administratif des projets
              d'EnR électriques soumis à appel d'offres en France.
            </p>
          </Container>
        </section>

        <section
          className="bg-blue-france-sun-base"
          style={{ background: 'linear-gradient(180deg, #000091 50%, white 50%)' }}
        >
          <h1 className="sr-only" style={{ fontFamily: 'Marianne, arial, sans-serif' }}>
            Inscription ou connection
          </h1>
          <Container className="flex p-6 md:p-12">
            {user ? (
              <div className="flex flex-col items-center md:mx-auto shadow-md bg-blue-france-975-base p-7">
                <p className="mt-0 text-2xl lg:text-3xl font-semibold text-blue-france-sun-base">
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
              <div className="flex mx-auto flex-col lg:flex-row">
                <SignupBox />
                <LoginBox />
              </div>
            )}
          </Container>
        </section>

        <section className="text-blue-france-sun-base mb-10">
          <h1
            className="text-3xl lg:text-4xl xl:text-5xl font-semibold lg:pt-10 text-center mb-20"
            style={{ fontFamily: 'Marianne, arial, sans-serif' }}
          >
            Producteurs d'énergies renouvelables électriques
          </h1>
          <Container>
            <div className="flex-2">
              <img className="object-scale-down w-full" src="/images/home/enr-illustration.png" />
            </div>
            <div className="bg-blue-france-975-base p-10">
              <ul className="text-lg md:text-base lg:text-xl font-medium md:font-semibold">
                <Benefice title="Retrouvez vos projets" />
                <Benefice title="Suivez-les étape par étape" />
                <Benefice title="Gérer vos documents" />
                <Benefice title="Signalez des changements" />
                <Benefice title="Demandez des modifications" />
                <Benefice title="Invitez vos collègues" />
              </ul>
            </div>
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

const tabItems = [
  { id: 1, title: 'Porteur de projet', url: 'http://localhost:3000/login.html', current: true },
  { id: 2, title: 'Autre partenaire', url: '', current: false },
]

const SignupBox = () => {
  const [active, setActive] = useState(1)

  return (
    <div className="p-4 lg:px-16 lg:py-10 shadow-md text-center flex-1 flex flex-col justify-between gap-7 bg-white">
      <h2
        className="text-blue-france-sun-base font-semibold text-4xl m-0 pb-5"
        style={{ fontFamily: 'Marianne, arial, sans-serif' }}
      >
        Inscription
      </h2>
      <div className="flex justify-center">
        {tabItems.map(({ id, title }) => (
          <Tab
            key={title}
            title={title}
            onItemClicked={() => setActive(id)}
            isActive={active === id}
          />
        ))}
      </div>
      {active === 1 && (
        <>
          <p className="m-0 p-0">
            Porteur de projets, inscrivez-vous dès maintenant pour suivre et mettre à jour vos
            projets.
          </p>
          <LinkButton href="" className="mx-auto">
            <RiAccountCircleLine className="mr-4" />
            M'inscrire
          </LinkButton>
        </>
      )}
      {active === 2 && (
        <>
          <p className="m-0 p-0">
            Autre partenaire, envoyez-nous une demande par email pour obtenir un accès à Potentiel.
          </p>
          <LinkButton className="mx-auto" href="mailto:contact@potentiel.beta.gouv.fr">
            <RiMailAddFill className="mr-4" />
            Nous contacter
          </LinkButton>
        </>
      )}
      <p className="m-0">
        <a href={routes.LOGIN}>Vous avez déjà un compte ?</a>
      </p>
    </div>
  )
}

type TabProps = {
  title: string
  isActive: boolean
  onItemClicked: () => void
}

const Tab = ({ title, onItemClicked, isActive = false }: TabProps) => {
  return (
    <div>
      <button
        onClick={onItemClicked}
        className={`rounded-none bg-white px-5 py-3 whitespace-nowrap text-lg font-semibold ${
          isActive
            ? ' border border-solid border-t-4 border-x-1 border-b-0 border-t-slate-700 border-x-slate-300'
            : 'bg-blue-france-975-base border-none text-blue-france-sun-base'
        }`}
      >
        {title}
      </button>
    </div>
  )
}

const LoginBox = () => {
  return (
    <div
      className=" p-4 lg:px-16 lg:py-10 shadow-md text-center flex-1 flex flex-col justify-between gap-7"
      style={{ backgroundColor: '#e3e3fd' }}
    >
      <h2
        className="text-blue-france-sun-base font-semibold text-4xl m-0 pb-5"
        style={{ fontFamily: 'Marianne, arial, sans-serif' }}
      >
        Connexion
      </h2>
      <p className="m-0 whitespace-nowrap font-semibold text-xl text-blue-france-sun-base">
        Nous sommes ravis de vous revoir !
      </p>
      <p className="m-0 p-0">
        Vous avez déjà un compte sur Potentiel ? Connectez-vous pour accéder aux projets.
      </p>
      <LinkButton href={routes.LOGIN} primary={true} className="mx-auto">
        <RiAccountPinBoxLine className="mr-4" />
        M'identifier
      </LinkButton>
      <p className="m-0">
        <a href="">Mot de passe oublié</a>
      </p>
    </div>
  )
}

type BeneficeProps = {
  title: string
}
const Benefice = ({ title }: BeneficeProps) => (
  <li className="leading-loose whitespace-nowrap list-none">
    <img src="/images/home/check.png" className="align-bottom mr-2"></img>
    {title}
  </li>
)

const InscriptionBox2 = () => {
  return (
    <div className="px-14 py-14 shadow-md text-center flex-1 flex flex-col justify-between gap-7 bg-white">
      <p className="text-blue-france-sun-base font-semibold text-4xl m-0 pb-5">Inscription</p>
      <p className="m-0 whitespace-nowrap font-semibold text-xl text-blue-france-sun-base">
        Je souhaite m'inscrire en tant que
      </p>
      <div className="flex gap-3">
        <LinkButton href={routes.LOGIN} primary={true} className="mx-auto whitespace-nowrap">
          Porteur de projet
        </LinkButton>
        <LinkButton href={routes.LOGIN} primary={true} className="mx-auto whitespace-nowrap">
          Autre partenaire
        </LinkButton>
      </div>
      <p className="m-0">
        <a href={routes.LOGIN}>Vous avez déjà un compte ?</a>
      </p>
    </div>
  )
}

hydrateOnClient(Home)
