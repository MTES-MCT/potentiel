import React from 'react'
import routes from '@routes'
import { Request } from 'express'
import { RiAccountCircleLine } from '@react-icons/all-files/ri/RiAccountCircleLine'
import { RiCloseLine } from '@react-icons/all-files/ri/RiCloseLine'
import { RiExternalLinkLine } from '@react-icons/all-files/ri/RiExternalLinkLine'
import { RiLogoutBoxLine } from '@react-icons/all-files/ri/RiLogoutBoxLine'
import { RiMenuLine } from '@react-icons/all-files/ri/RiMenuLine'
import { RiQuestionLine } from '@react-icons/all-files/ri/RiQuestionLine'
import { RiUserLine } from '@react-icons/all-files/ri/RiUserLine'
import { RiLockLine } from '@react-icons/all-files/ri/RiLockLine'

type HeaderProps = {
  user?: Request['user']
  children?: React.ReactNode
}

const Header: React.FC<HeaderProps> & { MenuItem: typeof MenuItem } = ({
  user,
  children,
}: HeaderProps) => {
  const menuItems = React.Children.map(children, (child: React.ReactElement) => {
    if (child.type === MenuItem) {
      return child
    }
  })

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
              <div className={`flex flex-row ml-auto ${menuItems && 'mr-4'}`}>
                <QuickAccess {...{ user }} />
              </div>
            </section>
          </div>

          {menuItems && (
            <div className="lg:border-0 lg:border-t lg:border-solid lg:border-slate-200 ">
              <section className="flex flex-col xl:mx-auto xl:max-w-7xl">
                <MainMenu>{menuItems}</MainMenu>
              </section>
            </div>
          )}
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
  <a className="ml-2 lg:ml-8 no-underline" href={routes.HOME}>
    <div className="font-bold lg:text-xl text-black">Potentiel</div>
    <div className="hidden lg:block text-base text-black">
      Facilite le parcours des producteurs
      <br />
      d'énergies renouvelables électriques
    </div>
  </a>
)

type QuickAccessProps = {
  user?: Request['user']
}
const QuickAccess = ({ user }: QuickAccessProps) => (
  <ul className="flex flex-row text-xl lg:text-sm font-normal list-none p-0 m-0 lg:mr-0">
    {user ? (
      <>
        <li className="flex items-center">
          {['admin', 'dgec'].includes(user.role) ? (
            <a
              className="no-underline flex flex-row items-center px-2 md:px-3 lg:border-0 lg:border-r lg:border-slate-200 lg:border-solid text-blue-france-sun-base"
              href={user.accountUrl}
            >
              <RiUserLine />
              <span
                className="max-w-xs whitespace-nowrap overflow-hidden overflow-ellipsis pt-0.5 mx-1"
                title={user.fullName ? user.fullName : user.email}
              >
                {user.fullName ? user.fullName : user.email}
              </span>
            </a>
          ) : (
            <span
              className="hidden lg:flex flex-row items-center px-2 md:px-3 lg:border-0 lg:border-r lg:border-slate-200 lg:border-solid"
              style={{ color: 'var(--text-default-grey)' }}
            >
              <RiUserLine />
              <span
                className="max-w-xs whitespace-nowrap overflow-hidden overflow-ellipsis pt-0.5 mx-1"
                title={user.fullName ? user.fullName : user.email}
              >
                {user.fullName ? user.fullName : user.email}
              </span>
            </span>
          )}
        </li>
        <li className="flex items-center">
          <a
            className="no-underline flex flex-row items-center px-2 md:px-3 lg:border-0 lg:border-r lg:border-slate-200 lg:border-solid"
            href={routes.LOGOUT_ACTION}
          >
            <RiLogoutBoxLine className="text-blue-france-sun-base" />
            <span className="hidden lg:block pt-0.5 mx-1 text-blue-france-sun-base">
              Me déconnecter
            </span>
          </a>
        </li>
      </>
    ) : (
      <>
        <li className="flex items-center">
          <a
            className="no-underline flex flex-row items-center px-2 md:px-3 lg:border-0 lg:border-r lg:border-slate-200 lg:border-solid"
            href={routes.SIGNUP}
          >
            <RiAccountCircleLine className="text-blue-france-sun-base" />
            <span className="hidden lg:block pt-0.5 mx-1 text-blue-france-sun-base">
              M'inscrire
            </span>
          </a>
        </li>
        <li className="flex items-center">
          <a
            className="no-underline flex flex-row items-center px-2 md:px-3 lg:border-0 lg:border-r lg:border-slate-200 lg:border-solid text-blue-france-sun-base"
            href={routes.LOGIN}
          >
            <RiLockLine className="text-blue-france-sun-base" />
            <span className="hidden lg:block pt-0.5 mx-1 text-blue-france-sun-base">
              M'identifier
            </span>
          </a>
        </li>
      </>
    )}
    <li className="flex items-center">
      <a
        className="no-underline flex flex-row items-center px-2 md:px-3 text-blue-france-sun-base"
        target="_blank"
        rel="noopener"
        href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel"
      >
        <RiQuestionLine className="lg:hidden text-blue-france-sun-base" />
        <span className="hidden lg:block pt-0.5 mx-1 text-blue-france-sun-base">Aide</span>
        <RiExternalLinkLine className="hidden lg:block text-blue-france-sun-base" />
      </a>
    </li>
  </ul>
)

type MainMenuProps = {
  children: React.ReactNode
}
const MainMenu = ({ children }: MainMenuProps) => (
  <>
    <input id="menu-toggle" className="hidden" type="checkbox" />
    <label className="absolute top-3 right-2 text-xl lg:hidden" htmlFor="menu-toggle">
      <RiMenuLine className="menu-open" />
      <RiCloseLine className="menu-close hidden" />
    </label>
    <nav className="menu hidden lg:block absolute lg:relative top-8 lg:top-0 left-0 w-full h-full lg:h-auto bg-white lg:bg-transparent z-50 pt-6 lg:pt-0">
      <ul className="flex flex-col list-none px-0 py-2 lg:py-0 m-0 lg:flex-row lg:text-sm lg:font-normal">
        {children}
      </ul>
    </nav>
  </>
)

type MenuItemProps = {
  href: string
  isCurrent?: true
  children: React.ReactNode
}
const MenuItem = ({ children, href, isCurrent }: MenuItemProps) => (
  <li className="py-2 px-4 border-0 border-b lg:border-b-0 border-solid border-slate-200 lg:p-4">
    <a
      className={`no-underline pl-4 lg:pl-0 lg:pb-3  ${
        isCurrent
          ? 'text-blue-france-sun-base font-medium border-0 border-l-4 border-solid border-blue-france-sun-base lg:border-l-0 lg:border-b-4'
          : 'text-black'
      }`}
      href={href}
      {...(isCurrent ? { 'aria-current': 'page' } : { style: { color: 'black' } })}
    >
      {children}
    </a>
  </li>
)

Header.MenuItem = MenuItem
export { Header }
