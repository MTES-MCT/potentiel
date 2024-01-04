import React, { useEffect, useState } from 'react';

import routes from '../../../../routes';

import {
  ExternalLinkIcon,
  Link,
  QuestionIcon,
  LoginIcon,
  UserIcon,
  MenuIcon,
  LogoutBoxIcon,
  CloseIcon,
  Checkbox,
  Label,
  Container,
  AccountIcon,
  TasksToDo,
  TasksDone,
} from '../..';
import { UtilisateurReadModel } from '../../../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { GET_SENREGISTRER } from '@potentiel/legacy-routes';

type HeaderProps = {
  user?: UtilisateurReadModel;
  children?: React.ReactNode;
};

const LogoAndTitle = () => (
  <>
    <div className="hidden print:flex items-center">
      <img src="/images/logo-ministere-de-la-transition-energetique.png" className="w-[150px]" />
      <div className="ml-4 no-underline">
        <div className="font-bold text-xl text-black">Potentiel</div>
        <div className="text-base text-black">
          Facilite le parcours des producteurs
          <br />
          d'énergies renouvelables électriques
        </div>
      </div>
    </div>
    <Link
      className="no-underline hover:no-underline focus:no-underline visited:no-underline"
      href={routes.HOME}
      title="Retour à l'accueil"
      aria-label="Retour à l'accueil"
    >
      <div className="flex items-center">
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
      </div>
    </Link>
  </>
);

const Header: React.FC<HeaderProps> & { MenuItem: typeof MenuItem } = ({
  user,
  children,
}: HeaderProps) => {
  const [skipLinksVisible, setSkipLinksVisible] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Tab') {
        setSkipLinksVisible(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <header className="py-2 lg:py-0 text-lg shadow-md print:shadow-none">
        {skipLinksVisible && <MenuAccèsRapides menuDisponible={!!children} />}
        <Container>
          <div className="flex flex-row pb-1 lg:py-4 items-center">
            <LogoAndTitle />
            <div className={`flex flex-row ml-auto ${children && 'mr-6'}`}>
              <QuickAccess {...{ user }} />
            </div>
          </div>
        </Container>

        {children && (
          <div className="lg:border-0 lg:border-t lg:border-solid lg:border-slate-200 lg:mt-5">
            <Container>
              <MainMenu>{children}</MainMenu>
            </Container>
          </div>
        )}
      </header>
    </>
  );
};

type QuickAccessProps = {
  user?: UtilisateurReadModel;
};
const QuickAccess = ({ user }: QuickAccessProps) => (
  <ul className="flex flex-row text-xl lg:text-sm font-normal list-none p-0 m-0 lg:mr-0 print:hidden">
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
            <>
              {user.role === 'porteur-projet' && <CentreDesTâches />}
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
            </>
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
            href={GET_SENREGISTRER}
          >
            <AccountIcon className="text-blue-france-sun-base" aria-hidden />
            <span className="hidden lg:block mx-1 text-blue-france-sun-base">M'inscrire</span>
          </Link>
        </li>
        <li>
          <Link
            className="no-underline hover:no-underline flex flex-row items-center px-2 md:px-3 lg:border-0 lg:border-r lg:border-slate-200 lg:border-solid text-blue-france-sun-base"
            href={routes.LOGIN}
          >
            <LoginIcon className="text-blue-france-sun-base" aria-hidden />
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
        href={
          user?.role === 'dreal'
            ? 'https://potentiel.gitbook.io/guide-potentiel-dreal/guide-dutilisation/sommaire-du-guide-dutilisation'
            : 'https://docs.potentiel.beta.gouv.fr/guide-dutilisation/sommaire-du-guide-dutilisation'
        }
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
  <div className="print:hidden">
    <Checkbox id="menu-toggle" className="hidden" />
    <Label className="absolute top-3 right-2 text-xl lg:hidden" htmlFor="menu-toggle">
      <MenuIcon className="menu-open" />
      <CloseIcon className="menu-close hidden" />
    </Label>
    <nav
      id="menu-principal"
      className="menu hidden lg:block absolute lg:relative top-8 lg:top-0 left-0 w-full h-full lg:h-auto bg-white lg:bg-transparent z-50 pt-6 lg:pt-0"
    >
      <ul className="flex flex-col list-none px-0 py-2 lg:py-0 m-0 lg:flex-row lg:text-sm lg:font-normal">
        {children}
      </ul>
    </nav>
  </div>
);

type MenuItemProps = {
  href: string;
  isCurrent?: true;
  children: React.ReactNode;
};
const MenuItem = ({ children, href, isCurrent }: MenuItemProps) => (
  <li
    className={`flex items-center py-2 lg:p-4 border-0 border-b lg:border-b-0 border-solid border-slate-200 hover:bg-grey-1000-hover ${
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

type MenuAccèsRapidesProps = { menuDisponible: boolean };
const MenuAccèsRapides = ({ menuDisponible }: MenuAccèsRapidesProps) => (
  <nav role="navigation" aria-label="Accès rapide" className="print:hidden bg-grey-950-base">
    <Container>
      <ul className="flex row list-none justify-start px-0 py-4 gap-4 my-0">
        <li>
          <Link href="#contenu">Accéder au contenu</Link>
        </li>
        {menuDisponible && (
          <li>
            <Link href="#menu-principal">Accéder au menu</Link>
          </li>
        )}
        <li>
          <Link href="#pied-de-page">Accéder au pied de page</Link>
        </li>
      </ul>
    </Container>
  </nav>
);

const CentreDesTâches = () => {
  const [nombreTâches, setNombreDeTâches] = useState(0);
  const [showNombreDeTâches, setShowNombreDeTâches] = useState(false);
  useEffect(() => {
    const récupérerLeNombreDeTâches = async () => {
      try {
        const response = await fetch('/api/v1/taches');
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const { nombreTâches } = await response.json();
        setNombreDeTâches(nombreTâches);
        setShowNombreDeTâches(true);
      } catch (error) {
        console.error('Erreur lors de la récupération du nombre de tâches : ', error);
      }
    };

    récupérerLeNombreDeTâches();
  }, []);
  return (
    <Link
      href="/taches"
      className={`no-underline hover:no-underline flex flex-row items-center px-2 md:px-3 lg:border-0 lg:border-r lg:border-slate-200 lg:border-solid text-blue-france-sun-base`}
    >
      {nombreTâches > 0 ? <TasksToDo aria-hidden /> : <TasksDone aria-hidden />}
      <span className="hidden lg:block mx-1 text-blue-france-sun-base">
        Tâches ({!showNombreDeTâches ? 'chargement en cours...' : nombreTâches})
      </span>
    </Link>
  );
};

export { Header };
