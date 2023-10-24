import { DsfrHead } from '@codegouvfr/react-dsfr/next-appdir/DsfrHead';
import { DsfrProvider } from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider';
import { getHtmlAttributes } from '@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes';
import { StartDsfr } from './StartDsfr';
import { Header } from '@codegouvfr/react-dsfr/Header';
import { Footer } from '@codegouvfr/react-dsfr/Footer';
import { fr } from '@codegouvfr/react-dsfr';
import Link from 'next/link';
import { defaultColorScheme } from './defaultColorScheme';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html {...getHtmlAttributes({ defaultColorScheme })}>
      <head>
        <title>Potentiel</title>
        <StartDsfr />
        <DsfrHead
          Link={Link}
          preloadFonts={[
            //"Marianne-Light",
            //"Marianne-Light_Italic",
            'Marianne-Regular',
            //"Marianne-Regular_Italic",
            'Marianne-Medium',
            //"Marianne-Medium_Italic",
            'Marianne-Bold',
            //"Marianne-Bold_Italic",
            //"Spectral-Regular",
            //"Spectral-ExtraBold"
          ]}
        />
      </head>
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <DsfrProvider>
          <Header
            brandTop={
              <>
                République
                <br />
                Française
              </>
            }
            serviceTitle="Potentiel"
            serviceTagline={
              <>
                Facilite le parcours des producteurs
                <br />
                d'énergies renouvelables électriques
              </>
            }
            homeLinkProps={{
              href: '/',
              title: 'Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)',
            }}
            quickAccessItems={[
              {
                iconId: 'ri-account-circle-line',
                linkProps: {
                  href: '/signup.html',
                },
                text: "M'inscrire",
              },
              {
                iconId: 'ri-lock-line',
                linkProps: {
                  href: '/login.html',
                },
                text: "M'identifier",
              },
              {
                iconId: 'ri-question-line',
                linkProps: {
                  target: '_blank',
                  href: 'https://docs.potentiel.beta.gouv.fr/guide-dutilisation/sommaire-du-guide-dutilisation',
                },
                text: 'Aide',
              },
            ]}
          />
          <div
            style={{
              flex: 1,
              margin: 'auto',
              maxWidth: 1000,
              ...fr.spacing('padding', {
                topBottom: '10v',
              }),
            }}
          >
            {children}
          </div>
          <Footer
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
        </DsfrProvider>
      </body>
    </html>
  );
}
