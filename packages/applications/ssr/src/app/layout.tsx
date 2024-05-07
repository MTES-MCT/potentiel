/* eslint-disable no-console */
import './global.css';

import { SkipLinks } from '@codegouvfr/react-dsfr/SkipLinks';
import { DsfrHead } from '@codegouvfr/react-dsfr/next-appdir/DsfrHead';
import { getHtmlAttributes } from '@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes';
import { Metadata } from 'next';
import Link from 'next/link';

import { Footer } from '@/components/organisms/Footer';
import { Header } from '@/components/organisms/Header';

import initSentry from '../utils/sentry';

import { BootstrapApp } from './BootstrapApp';
import Providers from './Providers';
import { StartDsfr } from './StartDsfr';
import { defaultColorScheme } from './defaultColorScheme';

export const metadata: Metadata = {
  title: 'Potentiel',
};

export const dynamic = 'force-dynamic';

type RootLayoutProps = {
  children: JSX.Element;
};

export default function RootLayout({ children }: RootLayoutProps) {
  initSentry();

  //NOTE: The lang parameter is optional and defaults to "fr"
  return (
    <html {...getHtmlAttributes({ defaultColorScheme })} lang="fr">
      <BootstrapApp />

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
