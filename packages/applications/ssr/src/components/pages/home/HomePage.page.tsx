import Image from 'next/image';
import Link from 'next/link';
import Button from '@codegouvfr/react-dsfr/Button';
import { match } from 'ts-pattern';

import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';

export type HomePageProps = {
  utilisateur?: Utilisateur.ValueType;
};
export function HomePage({ utilisateur }: HomePageProps) {
  return (
    <>
      <PropositionDeValeur />
      {utilisateur ? <Bienvenue utilisateur={utilisateur} /> : <InscriptionConnexion />}
      <Benefices />
    </>
  );
}

const PropositionDeValeur = () => (
  <section className="text-theme-white bg-theme-blueFrance">
    <div className="flex flex-col xl:mx-auto xl:max-w-7xl px-2 lg:px-4  p-6 gap-6 xl:pt-10">
      <div className="flex flex-col md:flex-row">
        <h1 className="text-theme-white m-0 text-3xl lg:text-4xl xl:text-5xl font-semibold lg:pt-10 md:w-1/2">
          Suivez efficacement vos projets d'EnR* électriques, transmettez vos documents, demandez
          des modifications.
          <br />
          <span className="text-sm lg:text-base font-light">*Énergies renouvelables</span>
        </h1>
        <Image
          className="flex w-full md:w-1/2"
          src="/illustrations/proposition_valeur.png"
          aria-hidden
          width={752}
          height={445}
          alt=""
        />
      </div>
      <p className="text-lg md:text-base lg:text-xl font-medium md:font-semibold md:text-center md:m-0 md:mt-10 md:mb-0 lg:px-16 lg:leading-loose">
        Potentiel est le service du Ministère chargé de l'énergie qui connecte
        <br className="hidden md:inline" /> les acteurs du parcours administratif des projets d'EnR
        électriques soumis à appel d'offres en France.
      </p>
    </div>
  </section>
);

const listeBenefices = [
  'Retrouvez vos projets',
  'Suivez-les étape par étape',
  'Gérez vos documents',
  'Signalez des changements',
  'Demandez des modifications',
  'Invitez vos collègues',
];

const Benefices = () => (
  <section className="mb-10">
    <h2 className="text-theme-blueFrance text-3xl lg:text-4xl xl:text-5xl font-semibold pb-5 pt-10 px-4 text-center mb-0 md:mb-10">
      Producteurs d'énergies renouvelables électriques
    </h2>
    <div className="flex flex-col lg:flex-row xl:mx-auto xl:max-w-7xl px-2 lg:px-4">
      <Image
        className="flex-2 hidden md:block self-center w-full p-4 lg:w-3/5"
        src="/illustrations/enr-illustration.png"
        width={889}
        height={498}
        aria-hidden
        alt=""
      />
      <div className="text-theme-blueFrance bg-[#f5f5fe] lg:p-10 w-full lg:w-2/5">
        <ul className="flex flex-col text-lg xl:text-xl font-medium md:font-semibold w-fit md:mx-auto m-0 p-4">
          {listeBenefices.map((benefice) => (
            <li key={benefice} className="flex flex-row items-center leading-loose list-none">
              <Image
                src="/illustrations/check.png"
                className="align-bottom mr-2"
                aria-hidden
                alt=""
                width={71}
                height={71}
              />
              {benefice}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

type BienvenueProps = {
  utilisateur: Utilisateur.ValueType;
};
const Bienvenue = ({ utilisateur }: BienvenueProps) => {
  const { lien, texte } = match(utilisateur.role.nom)
    .with('porteur-projet', () => ({
      texte: 'Voir mes projets',
      lien: Routes.Projet.lister(),
    }))
    .with('grd', () => ({ texte: 'Voir les raccordements', lien: Routes.Raccordement.lister }))
    .otherwise(() => ({ texte: 'Voir les projets', lien: Routes.Projet.lister() }));
  return (
    <section className="bg-[linear-gradient(180deg,_#000091_50%,_white_50%)]">
      <h2 className="sr-only">Accéder à Potentiel</h2>
      <div className="flex xl:mx-auto xl:max-w-5xl px-2 lg:px-4 p-0 lg:p-8">
        <div className="flex flex-col items-center md:mx-auto shadow-md bg-[#f5f5fe] p-10">
          <p className="mt-0 mb-6 text-2xl lg:text-3xl font-semibold text-theme-blueFrance">
            Bonjour {utilisateur.nom}, nous sommes ravis de vous revoir.
          </p>
          <div className="flex flex-col md:flex-row w-full md:w-fit gap-3">
            <Button
              className="inline-flex items-center lg:text-lg"
              iconId="ri-dashboard-line"
              linkProps={{
                href: lien,
              }}
            >
              {texte}
            </Button>
            <Button
              className="inline-flex items-center lg:text-lg"
              iconId="ri-logout-box-line"
              priority="secondary"
              linkProps={{
                href: Routes.Auth.signOut(),
              }}
            >
              Me déconnecter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const InscriptionConnexion = () => (
  <section className="lg:p-8 bg-[linear-gradient(180deg,_#000091_50%,_white_50%)]">
    <h2 className="sr-only">Accéder à Potentiel</h2>
    <div className="flex xl:mx-auto xl:max-w-5xl px-2 lg:px-4 p-0 lg:p-8">
      <div className="flex mx-auto flex-col lg:flex-row">
        <div className="bg-theme-white px-2 py-4 md:px-12 md:py-10 shadow-md text-center flex-1 flex flex-col gap-[1.72rem]">
          <h3 className="text-theme-blueFrance font-semibold text-4xl m-0 pb-5">Inscription</h3>
          <div>
            <div className="fr-tabs shadow-none before:shadow-none">
              <ul className="fr-tabs__list text-theme-blueFrance" role="tablist">
                <li role="presentation">
                  <button
                    id="tabpanel-404"
                    className="fr-tabs__tab"
                    tabIndex={0}
                    role="tab"
                    aria-selected="true"
                    aria-controls="tabpanel-404-panel"
                  >
                    Porteur de projet
                  </button>
                </li>
                <li role="presentation">
                  <button
                    id="tabpanel-405"
                    className="fr-tabs__tab"
                    tabIndex={-1}
                    role="tab"
                    aria-selected="false"
                    aria-controls="tabpanel-405-panel"
                  >
                    Autre partenaire
                  </button>
                </li>
              </ul>
              <div
                id="tabpanel-404-panel"
                className="fr-tabs__panel fr-tabs__panel--selected"
                role="tabpanel"
                aria-labelledby="tabpanel-404"
                tabIndex={0}
              >
                <Button
                  linkProps={{ href: '/signup.html' }}
                  priority="secondary"
                  className="inline-flex items-center mx-auto my-2"
                  iconId="ri-lock-line"
                >
                  M'inscrire
                </Button>
              </div>
              <div
                id="tabpanel-405-panel"
                className="fr-tabs__panel"
                role="tabpanel"
                aria-labelledby="tabpanel-405"
                tabIndex={0}
              >
                <p className="m-0 p-0 font-semibold text-lg">
                  Contactez-nous <Link href="mailto:contact@potentiel.beta.gouv.fr">par email</Link>{' '}
                  <br />
                  pour obtenir un accès à Potentiel.
                </p>
              </div>
            </div>
            <p className="m-0 text-theme-blueFrance">
              <Link href={Routes.Auth.signIn()}>Vous avez déjà un compte ?</Link>
            </p>
          </div>
        </div>
        <div className="bg-[#f5f5fe] px-2 py-4 md:px-12 md:py-10 shadow-md text-center flex-1 flex flex-col gap-[1.72rem]">
          <h3 className="text-theme-blueFrance font-semibold text-4xl m-0 pb-5">Connexion</h3>
          <div>
            <p className="m-0 mb-3 font-semibold text-xl text-theme-blueFrance md:whitespace-nowrap">
              Vous avez déjà un compte sur Potentiel ?
            </p>
            <p className="m-0 p-0">Connectez-vous pour accéder aux projets.</p>
          </div>
          <Button
            linkProps={{ href: Routes.Auth.signIn() }}
            className="inline-flex items-center mx-auto"
            iconId="ri-lock-line"
          >
            M'identifier
          </Button>
        </div>
      </div>
    </div>
  </section>
);
