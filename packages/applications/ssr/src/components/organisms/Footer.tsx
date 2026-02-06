import DsfrFooter from '@codegouvfr/react-dsfr/Footer';

import { Routes } from '@potentiel-applications/routes';

export const Footer = () => (
  <DsfrFooter
    id="footer"
    brandTop={<>Gouvernement</>}
    accessibility="non compliant"
    accessibilityLinkProps={{
      href: `https://docs.potentiel.beta.gouv.fr/declaration-daccessibilite`,
      target: '_blank',
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
      target: '_blank',
    }}
    bottomItems={[
      {
        text: "Conditions générales d'utilisation",
        linkProps: {
          href: 'https://docs.potentiel.beta.gouv.fr/info/conditions-generales-dutilisation',
          target: '_blank',
        },
      },
      {
        text: 'Politique de confidentialité',
        linkProps: {
          href: 'https://docs.potentiel.beta.gouv.fr/info/vie-privee-et-politique-de-confidentialite',
          target: '_blank',
        },
      },
      {
        text: "Guide d'utilisation",
        linkProps: {
          href: 'https://docs.potentiel.beta.gouv.fr/',
          target: '_blank',
        },
      },
      {
        text: 'Statistiques',
        linkProps: {
          href: Routes.StatistiquesPubliques.consulter,
          prefetch: false,
        },
      },
    ]}
  />
);
