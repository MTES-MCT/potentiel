import React from 'react';
import routes from '@routes';
import { RiAccountCircleLine } from '@react-icons/all-files/ri/RiAccountCircleLine';

import {
  ExternalLinkIcon,
  Link,
  QuestionIcon,
  LockIcon,
  UserIcon,
  MenuIcon,
  LogoutBoxIcon,
  CloseIcon,
  InputCheckbox,
  Label,
} from '@components';
import { UtilisateurReadModel } from '@modules/utilisateur/récupérer/UtilisateurReadModel';

type HeaderProps = {
  user?: UtilisateurReadModel;
  children?: React.ReactNode;
};

const LogoAndTitle = () => (
  <Link
    className="flex items-center no-underline hover:no-underline focus:no-underline visited:no-underline"
    href={routes.HOME}
    title="Retour à l'accueil"
  >
    <div className="flex flex-col">
      <div className="lg:mb-1 logo-before" />
      <div className="hidden lg:block font-bold leading-none tracking-tighter text-black">
        RÉPUBLIQUE
        <br />
        FRANÇAISE
      </div>
      <div className="hidden lg:block logo-after" />
    </div>
    <div className="ml-2 lg:ml-8 no-underline">
      <div className="font-bold lg:text-xl text-black">Potentiel</div>
      <div className="hidden lg:block text-base text-black">
        Facilite le parcours des producteurs
        <br />
        d'énergies renouvelables électriques
      </div>
    </div>
  </Link>
);

const Header: React.FC<HeaderProps> & { MenuItem: typeof MenuItem } = ({
  user,
  children,
}: HeaderProps) => {
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
            <MenuAccèsRapides />
            <section className="flex flex-row px-2 pb-1 lg:p-4 items-center">
              <LogoAndTitle />
              <div className={`flex flex-row ml-auto ${children && 'mr-4'}`}>
                <QuickAccess {...{ user }} />
              </div>
            </section>
          </div>

          {children && (
            <div className="lg:border-0 lg:border-t lg:border-solid lg:border-slate-200 lg:mt-5">
              <section className="flex flex-col xl:mx-auto xl:max-w-7xl">
                <MainMenu>{children}</MainMenu>
              </section>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

type QuickAccessProps = {
  user?: UtilisateurReadModel;
};
const QuickAccess = ({ user }: QuickAccessProps) => (
  <ul className="flex flex-row text-xl lg:text-sm font-normal list-none p-0 m-0 lg:mr-0">
    {user ? (
      <>
        <li className="flex items-center">
          {['admin', 'dgec-validateur'].includes(user.role) ? (
            <Link
              className="no-underline hover:no-underline flex flex-row items-center px-2 md:px-3 lg:border-0 lg:border-r lg:border-slate-200 lg:border-solid text-blue-france-sun-base"
              href={user.accountUrl}
            >
              <UserIcon aria-hidden />
              <span
                className="hidden lg:block max-w-xs truncate pt-0.5 mx-1"
                title={user.fullName ? user.fullName : user.email}
              >
                {user.fullName ? user.fullName : user.email}
              </span>
            </Link>
          ) : (
            <span
              className="hidden lg:flex flex-row items-center px-2 md:px-3 lg:border-0 lg:border-r lg:border-slate-200 lg:border-solid"
              style={{ color: 'var(--text-default-grey)' }}
            >
              <UserIcon aria-hidden />
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
          <Link
            className="no-underline hover:no-underline flex flex-row items-center px-2 md:px-3 lg:border-0 lg:border-r lg:border-slate-200 lg:border-solid"
            href={routes.LOGOUT_ACTION}
          >
            <LogoutBoxIcon className="text-blue-france-sun-base" aria-hidden />
            <span className="hidden lg:block pt-0.5 mx-1 text-blue-france-sun-base">
              Me déconnecter
            </span>
          </Link>
        </li>
      </>
    ) : (
      <>
        <li>
          <Link
            className="no-underline hover:no-underline flex flex-row items-center px-2 md:px-3 lg:border-0 lg:border-r lg:border-slate-200 lg:border-solid"
            href={routes.SIGNUP}
          >
            <RiAccountCircleLine className="text-blue-france-sun-base" aria-hidden />
            <span className="hidden lg:block mx-1 text-blue-france-sun-base">M'inscrire</span>
          </Link>
        </li>
        <li>
          <Link
            className="no-underline hover:no-underline flex flex-row items-center px-2 md:px-3 lg:border-0 lg:border-r lg:border-slate-200 lg:border-solid text-blue-france-sun-base"
            href={routes.LOGIN}
          >
            <LockIcon className="text-blue-france-sun-base" aria-hidden />
            <span className="hidden lg:block mx-1 text-blue-france-sun-base">M'identifier</span>
          </Link>
        </li>
      </>
    )}
    <li>
      <Link
        className="no-underline hover:no-underline flex flex-row items-center px-2 md:px-3 text-blue-france-sun-base"
        target="_blank"
        rel="noopener"
        href="https://docs.potentiel.beta.gouv.fr"
      >
        <QuestionIcon className="lg:hidden text-blue-france-sun-base" />
        <span className="hidden lg:flex lg:items-center mx-1 text-blue-france-sun-base">
          <span className="pt-0.5">Aide</span>
          <ExternalLinkIcon className="w-4 h-4 ml-1" title="(ouvrir dans un nouvel onglet)" />
        </span>
      </Link>
    </li>
  </ul>
);

type MainMenuProps = {
  children: React.ReactNode;
};
const MainMenu = ({ children }: MainMenuProps) => (
  <>
    <InputCheckbox id="menu-toggle" className="hidden" />
    <Label className="absolute top-3 right-2 text-xl lg:hidden" htmlFor="menu-toggle">
      <MenuIcon className="menu-open" />
      <CloseIcon className="menu-close hidden" />
    </Label>
    <nav
      id="menu-principal"
      className="menu hidden lg:block absolute lg:relative top-8 lg:top-0 left-0 w-full h-full lg:h-auto bg-white lg:bg-transparent z-50 pt-6 lg:pt-0"
    >
      <ul className="flex flex-col list-none px-2 lg:px-0 py-2 lg:py-0 m-0 lg:flex-row lg:text-sm lg:font-normal">
        {children}
      </ul>
    </nav>
  </>
);

type MenuItemProps = {
  href: string;
  isCurrent?: true;
  children: React.ReactNode;
};
const MenuItem = ({ children, href, isCurrent }: MenuItemProps) => (
  <li
    className={`flex items-center py-2 lg:px-4 border-0 border-b lg:border-b-0 border-solid border-slate-200 lg:p-4 hover:bg-grey-1000-hover ${
      isCurrent && 'font-medium lg:border-l-0 lg:border-b-2 lg:border-b-blue-france-sun-base'
    }`}
  >
    {isCurrent && <div className="lg:hidden h-[24px] w-[2px] bg-blue-france-sun-base" />}
    <a
      className={`no-underline pl-4 lg:pl-0`}
      href={href}
      {...(isCurrent
        ? { 'aria-current': 'page', style: { color: '#000091' } }
        : { style: { color: 'black' } })}
    >
      {children}
    </a>
  </li>
);

Header.MenuItem = MenuItem;

const MenuAccèsRapides = () => (
  <nav role="navigation" aria-label="Accès rapide">
    <ul className="flex row list-none justify-start px-0 gap-2">
      <li>
        <Link href="#contenu">Contenu</Link>
      </li>
      <li>
        <Link href="#menu-principal">Menu</Link>
      </li>
      <li>
        <Link href="#pied-de-page">Pied de page</Link>
      </li>
    </ul>
  </nav>
);

export { Header };
