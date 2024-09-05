import './global.css';

import { DsfrHead } from '@codegouvfr/react-dsfr/next-appdir/DsfrHead';
import { getHtmlAttributes } from '@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes';
import { SkipLinks } from '@codegouvfr/react-dsfr/SkipLinks';
import { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';

import { Footer } from '@/components/organisms/Footer';
import { Header } from '@/components/organisms/Header';

import { BootstrapApp } from './BootstrapApp';
import { defaultColorScheme } from './defaultColorScheme';
import Providers from './Providers';
import { StartDsfr } from './StartDsfr';

export const metadata: Metadata = {
  title: 'Potentiel',
  description: "Facilite le parcours des producteurs d'énergies renouvelables électriques",
};

export const dynamic = 'force-dynamic';

type RootLayoutProps = {
  children: JSX.Element;
};

export default function RootLayout({ children }: RootLayoutProps) {
  //NOTE: The lang parameter is optional and defaults to "fr"
  const cspNonce = headers().get('x-nonce') ?? undefined;
  return (
    <html {...getHtmlAttributes({ defaultColorScheme })} lang="fr">
      <BootstrapApp />

      <head>
        <StartDsfr />
        <DsfrHead Link={Link} nonce={cspNonce} />
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
