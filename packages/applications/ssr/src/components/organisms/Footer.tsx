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
        et de la souveraineté
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
        text: "Conditions générales d'utilisation",
        linkProps: {
          href: 'https://docs.potentiel.beta.gouv.fr/info/conditions-generales-dutilisation',
        },
      },
      {
        text: 'Politique de confidentialité',
        linkProps: {
          href: 'https://docs.potentiel.beta.gouv.fr/info/vie-privee-et-politique-de-confidentialite',
        },
      },
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
    ]}
  />
);
