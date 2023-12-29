import './global.css';
import { DsfrHead } from '@codegouvfr/react-dsfr/next-appdir/DsfrHead';
import { getHtmlAttributes } from '@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes';
import { StartDsfr } from './StartDsfr';
import { defaultColorScheme } from './defaultColorScheme';
import Link from 'next/link';
import Providers from './Providers';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { SkipLinks } from '@codegouvfr/react-dsfr/SkipLinks';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Potentiel',
};

export default function RootLayout({ children }: { children: JSX.Element }) {
  //NOTE: The lang parameter is optional and defaults to "fr"
  return (
    <html {...getHtmlAttributes({ defaultColorScheme })} lang="fr">
      <head>
        <StartDsfr />
        <DsfrHead Link={Link} />
      </head>
      <body className="flex flex-col min-h-screen">
        <Providers>
          <SkipLinks
            links={[
              {
                anchor: '#contenu',
                label: 'Accéder au contenu',
              },
              {
                anchor: '#header-navigation',
                label: 'Accéder au menu',
              },
              {
                anchor: '#footer',
                label: 'Accéder au pied de page',
              },
            ]}
          />
          <Header />
          <main id="contenu" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
