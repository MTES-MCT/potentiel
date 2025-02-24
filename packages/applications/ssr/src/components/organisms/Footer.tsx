import DsfrFooter from '@codegouvfr/react-dsfr/Footer';

import { Routes } from '@potentiel-applications/routes';

export const Footer = () => (
  <DsfrFooter
    id="footer"
    brandTop={<>Gouvernement</>}
    accessibility="partially compliant"
    accessibilityLinkProps={{
      href: '/accessibilite.html',
    }}
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
          href: Routes.StatistiquesPubliques.consulter,
        },
      },
    ]}
  />
);
