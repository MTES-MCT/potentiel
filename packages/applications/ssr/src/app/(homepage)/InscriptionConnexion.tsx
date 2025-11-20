import Link from 'next/link';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

export const InscriptionConnexion = () => (
  <section className="lg:p-8 bg-[linear-gradient(180deg,_var(--text-label-blue-france)_50%,_var(--background-default-grey)_50%)]">
    <h2 className="sr-only">Accéder à Potentiel</h2>
    <div className="flex xl:mx-auto xl:max-w-5xl  lg:px-4 p-0 lg:p-8">
      <div className="flex mx-auto flex-col lg:flex-row">
        <div className="bg-theme-white px-2 py-4 md:px-12 md:py-10 shadow-md text-center flex-1 flex flex-col gap-[1.72rem]">
          <h3 id="inscription" className="text-theme-blueFrance font-semibold text-4xl m-0 pb-5">
            Inscription
          </h3>
          <div>
            <div className="fr-tabs shadow-none before:shadow-none">
              <ul
                className="fr-tabs__list px-0 flex justify-center text-theme-blueFrance"
                role="tablist"
              >
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
                  linkProps={{ href: Routes.Auth.signUp() }}
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
        <div className="bg-dsfr-background-alt-blueFrance-default px-2 py-4 md:px-12 md:py-10 shadow-md text-center flex-1 flex flex-col gap-[1.72rem]">
          <h3 id="connexion" className="text-theme-blueFrance font-semibold text-4xl m-0 pb-5">
            Connexion
          </h3>
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
