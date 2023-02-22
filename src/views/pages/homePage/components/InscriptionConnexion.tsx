import React, { useState } from 'react';
import { RiDashboardLine } from '@react-icons/all-files/ri/RiDashboardLine';
import { RiLogoutBoxLine } from '@react-icons/all-files/ri/RiLogoutBoxLine';
import { RiAccountCircleLine } from '@react-icons/all-files/ri/RiAccountCircleLine';
import { RiLockLine } from '@react-icons/all-files/ri/RiLockLine';
import { User } from '@entities';
import routes from '@routes';
import { LinkButton, Container, SecondaryLinkButton, Link } from '@components';

type InscriptionConnexionProps = {
  user: User;
};

export const InscriptionConnexion = ({ user }: InscriptionConnexionProps) => (
  <section
    className="bg-blue-france-sun-base"
    style={{ background: 'linear-gradient(180deg, #000091 50%, white 50%)' }}
  >
    <h2 className="sr-only" style={{ fontFamily: 'Marianne, arial, sans-serif' }}>
      Acccéder à Potentiel
    </h2>
    <Container className="flex p-0 lg:p-8">
      {user ? (
        <Bienvenue {...{ user }} />
      ) : (
        <div className="flex mx-auto flex-col lg:flex-row">
          <SignupBox />
          <LoginBox />
        </div>
      )}
    </Container>
  </section>
);

type BienvenueProps = {
  user: User;
};
const Bienvenue = ({ user }: BienvenueProps) => (
  <div className="flex flex-col items-center md:mx-auto shadow-md bg-blue-france-975-base p-10">
    <p className="mt-0 text-2xl lg:text-3xl font-semibold text-blue-france-sun-base">
      Bonjour {user.fullName}, nous sommes ravis de vous revoir.
    </p>
    <div className="flex flex-col md:flex-row w-full md:w-fit gap-3">
      <LinkButton
        className="inline-flex items-center lg:text-lg"
        href={routes.REDIRECT_BASED_ON_ROLE}
      >
        <RiDashboardLine className="mr-4" aria-hidden />
        Voir {user.role === 'porteur-projet' ? 'mes' : 'les'} projets
      </LinkButton>
      <SecondaryLinkButton
        className="inline-flex items-center lg:text-lg"
        href={routes.LOGOUT_ACTION}
      >
        <RiLogoutBoxLine className="mr-4" aria-hidden />
        Me déconnecter
      </SecondaryLinkButton>
    </div>
  </div>
);

const SignupBox = () => {
  const [active, setActive] = useState<'porteur-projet' | 'autre-partenaire'>('porteur-projet');

  return (
    <div className="px-2 py-4 md:px-12 md:py-10 shadow-md text-center flex-1 flex flex-col justify-between gap-7 bg-white">
      <h3
        className="text-blue-france-sun-base font-semibold text-4xl m-0 pb-5"
        style={{ fontFamily: 'Marianne, arial, sans-serif' }}
      >
        Inscription
      </h3>
      <div className="flex justify-center">
        <Tab
          key="porteur-projet"
          title="Porteur de projet"
          onItemClicked={() => setActive('porteur-projet')}
          isActive={active === 'porteur-projet'}
        />
        <Tab
          key="autre-partenaire"
          title="Autre partenaire"
          onItemClicked={() => setActive('autre-partenaire')}
          isActive={active === 'autre-partenaire'}
        />
      </div>
      {active === 'porteur-projet' && (
        <SecondaryLinkButton href={routes.SIGNUP} className="inline-flex items-center mx-auto">
          <RiAccountCircleLine className="mr-4" aria-hidden />
          M'inscrire
        </SecondaryLinkButton>
      )}
      {active === 'autre-partenaire' && (
        <p className="m-0 p-0 font-semibold text-lg">
          Contactez-nous par email <br />
          pour obtenir un accès à Potentiel.
        </p>
      )}
      <p className="m-0">
        <Link href={routes.LOGIN}>Vous avez déjà un compte ?</Link>
      </p>
    </div>
  );
};

type TabProps = {
  title: string;
  isActive: boolean;
  onItemClicked: () => void;
};

const Tab = ({ title, onItemClicked, isActive = false }: TabProps) => {
  return (
    <div>
      <button
        onClick={onItemClicked}
        className={`rounded-none bg-white px-5 py-3 text-lg font-semibold ${
          isActive
            ? ' border border-solid border-t-4 border-x-1 border-b-0 border-t-slate-700 border-x-slate-300'
            : 'bg-blue-france-975-base border-none text-blue-france-sun-base'
        }`}
      >
        {title}
      </button>
    </div>
  );
};

const LoginBox = () => {
  return (
    <div
      className="px-2 py-4 md:px-12 md:py-10 shadow-md text-center flex-1 flex flex-col gap-6"
      style={{ backgroundColor: '#f5f5fe' }}
    >
      <h3
        className="text-blue-france-sun-base font-semibold text-4xl m-0 pb-5"
        style={{ fontFamily: 'Marianne, arial, sans-serif' }}
      >
        Connexion
      </h3>
      <div>
        <p className="m-0 mb-3 font-semibold text-xl text-blue-france-sun-base md:whitespace-nowrap">
          Vous avez déjà un compte sur Potentiel ?
        </p>
        <p className="m-0 p-0">Connectez-vous pour accéder aux projets.</p>
      </div>
      <LinkButton href={routes.LOGIN} className="inline-flex items-center mx-auto">
        <RiLockLine className="mr-4" aria-hidden />
        M'identifier
      </LinkButton>
    </div>
  );
};
