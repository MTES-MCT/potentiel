import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { PotentielUtilisateur } from '@potentiel-applications/request-context';

import { getDashboardRoute } from '@/utils/getDashboardRoute';

type BienvenueProps = {
  utilisateur: PotentielUtilisateur;
};
export const Bienvenue = ({ utilisateur }: BienvenueProps) => {
  const { lien, texte } = getDashboardRoute(utilisateur.rôle);

  return (
    <section className="bg-[linear-gradient(180deg,_var(--text-label-blue-france)_50%,_var(--background-default-grey)_50%)]">
      <h2 className="sr-only">Accéder à Potentiel</h2>
      <div className="flex xl:mx-auto xl:max-w-5xl px-2 lg:px-4 p-0 lg:p-8">
        <div className="flex flex-col items-center md:mx-auto shadow-md bg-dsfr-background-alt-blueFrance-default p-10">
          <p className="mt-0 mb-6 text-2xl lg:text-3xl font-semibold text-theme-blueFrance">
            Bonjour{utilisateur.nom ? ` ${utilisateur.nom}` : ''}, nous sommes ravis de vous revoir.
          </p>
          <div className="flex flex-col items-center md:flex-row w-full md:w-fit gap-3">
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
