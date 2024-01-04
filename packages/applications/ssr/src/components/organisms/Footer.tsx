// import { ROUTES_LEGACY } from '@/routes.legacy';
import DsfrFooter from '@codegouvfr/react-dsfr/Footer';
import { PAGE_STATISTIQUES } from '@potentiel/legacy-routes';
import { Route } from 'next';

export const Footer = () => (
  <DsfrFooter
    id="footer"
    brandTop={
      <>
        Ministère
        <br />
        de la transition
        <br />
        énergétique
      </>
    }
    accessibility="partially compliant"
    contentDescription={
      <>
        Suivez efficacement vos projets :
        <br />
        Transmettez vos documents, demandez des modifications.
      </>
    }
    termsLinkProps={{
      href: 'https://docs.potentiel.beta.gouv.fr/info/cgu',
    }}
    bottomItems={[
      {
        text: "Guide d'utilisation",
        linkProps: {
          href: 'https://docs.potentiel.beta.gouv.fr/',
        },
      },
      {
        text: 'Statistiques',
        linkProps: {
          href: PAGE_STATISTIQUES as Route,
        },
      },
      {
        text: 'Gestion des cookies',
        linkProps: {
          href: 'https://docs.potentiel.beta.gouv.fr/info/cgu#cookies',
        },
      },
    ]}
  />
);
