import DsfrFooter from '@codegouvfr/react-dsfr/Footer';

export const Footer = () => (
  <DsfrFooter
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
          href: '/statistiques.html',
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
