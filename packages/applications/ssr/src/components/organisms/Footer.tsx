import DsfrFooter from '@codegouvfr/react-dsfr/Footer';

export const Footer = () => (
  <DsfrFooter
    id="footer"
    brandTop={
      <>
        Ministère
        <br />
        de l'économie
        <br />
        des finances
        <br />
        de la souveraineté
        <br />
        industrielle et numérique
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
          href: '/stats.html',
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
