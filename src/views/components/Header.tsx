import React from 'react'
import routes from '../../routes'
import { Request } from 'express'

type HeaderProps = {
  request: Request
}

const Header = ({ request }: HeaderProps) => {
  return (
    <>
      <header
        style={{
          fontFamily: 'Marianne, arial, sans-serif',
          boxShadow: '0 8px 8px 0 rgb(0 0 0 / 10%)',
        }}
      >
        <div className="p-2 lg:p-0 text-lg">
          <div className="flex flex-col xl:mx-auto xl:max-w-7xl">
            <section className="flex flex-row px-2 pb-1 lg:p-4 items-center">
              <Logo />
              <Title />
              <QuickAccess {...request} />
            </section>
          </div>

          {/* <div className="lg:border-0 lg:border-t lg:border-solid lg:border-slate-200 ">
            <section className="flex flex-col xl:mx-auto xl:max-w-7xl">
              <MainMenu />
            </section>
          </div> */}
        </div>
      </header>
    </>
  )
}

const Logo = () => (
  <div className="flex flex-col">
    <div className="lg:mb-1 logo-before"></div>
    <div className="hidden lg:block uppercase font-bold leading-none tracking-tighter">
      République
      <br />
      Française
    </div>
    <div className="hidden lg:block logo-after"></div>
  </div>
)

const Title = () => (
  <div className="ml-2 lg:ml-8">
    <div className="font-bold lg:text-xl">Potentiel</div>
    <div className="hidden lg:block text-base">
      Facilite le parcours des producteurs
      <br />
      d'énergies renouvelables électriques
    </div>
  </div>
)

type QuickAccessProps = {
  user: Request['user']
}
const QuickAccess = ({ user }: QuickAccessProps) => (
  <div className="flex flex-row ml-auto">
    <ul className="flex flex-row text-xl lg:text-sm font-normal list-none p-0 m-0 lg:mr-0">
      {user ? (
        <>
          <li>
            {['admin', 'dgec'].includes(user.role) ? (
              <a
                className="no-underline flex flex-row items-center px-2 md:px-3 lg:border-0 lg:border-r lg:border-slate-200 lg:border-solid"
                href={user.accountUrl}
                style={{ color: `#000091` }}
              >
                <i className="ri-user-line"></i>
                <span className="hidden lg:block pt-0.5 mx-1">{user.fullName}</span>
              </a>
            ) : (
              <span className="hidden lg:block" style={{ color: 'var(--text-default-grey)' }}>
                <i className="ri-user-line"></i>
                <span className="pt-0.5 mx-1">{user.fullName}</span>
              </span>
            )}
          </li>
          <li>
            <a
              className="no-underline flex flex-row items-center px-2 md:px-3 lg:border-0 lg:border-r lg:border-slate-200 lg:border-solid"
              href={routes.LOGOUT_ACTION}
              style={{ color: `#000091` }}
            >
              <i className="ri-logout-box-line"></i>
              <span className="hidden lg:block pt-0.5 mx-1">Me déconnecter</span>
            </a>
          </li>
        </>
      ) : (
        <li>
          <a
            className="no-underline flex flex-row items-center px-2 md:px-3 lg:border-0 lg:border-r lg:border-slate-200 lg:border-solid"
            href={routes.LOGIN}
            style={{ color: `#000091` }}
          >
            <i className="ri-account-circle-line"></i>
            <span className="hidden lg:block pt-0.5 mx-1">M'identifier</span>
          </a>
        </li>
      )}
      <li>
        <a
          className="no-underline flex flex-row items-center px-2 md:px-3"
          style={{ color: `#000091` }}
          target="_blank"
          rel="noopener"
          href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel"
        >
          <i className="ri-question-line lg:hidden"></i>
          <span className="hidden lg:block pt-0.5 mx-1">Aide</span>
          <i className="hidden lg:block ri-external-link-line"></i>
        </a>
      </li>
    </ul>
  </div>
)

const MainMenu = () => (
  <>
    <input id="menu-toggle" className="hidden" type="checkbox" />
    <label className="absolute top-2 right-2 text-xl lg:hidden" htmlFor="menu-toggle">
      <i className="menu-open ri-menu-line"></i>
      <i className="menu-close hidden ri-close-line"></i>
    </label>
    <nav className="menu hidden lg:block absolute lg:relative top-8 lg:top-0 left-0 w-full h-full lg:h-auto bg-white lg:bg-transparent z-50 pt-6 lg:pt-0">
      <ul className="flex flex-col list-none px-4 lg:px-0 py-2 lg:py-0 m-0 lg:flex-row lg:text-sm lg:font-normal">
        <li className="pb-4 lg:p-4">
          <a className="no-underline text-black" href="#">
            Ressources EnR
          </a>
        </li>
        <li className="pb-4 lg:p-4">
          <a className="no-underline text-black" href="#">
            Statistiques
          </a>
        </li>
        <li className="pb-4 lg:p-4">
          <a className="no-underline text-black" href="#">
            Nous contacter
          </a>
        </li>
      </ul>
    </nav>
  </>
)

export default Header
