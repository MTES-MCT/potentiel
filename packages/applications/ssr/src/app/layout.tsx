import './global.css';

import { DsfrHead } from '@codegouvfr/react-dsfr/next-appdir/DsfrHead';
import { getHtmlAttributes } from '@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes';
import { SkipLinks } from '@codegouvfr/react-dsfr/SkipLinks';
import { Metadata } from 'next';
import dynamicImport from 'next/dynamic';

import { getContext } from '@potentiel-applications/request-context';

import { Link } from '@/components/atoms/LinkNoPrefetch';
import { Footer } from '@/components/organisms/Footer';
import { Header } from '@/components/organisms/header/Header';

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
  const crispWebsiteId = process.env.CRISP_WEBSITE_ID;
  const CrispChat = dynamicImport(() => import('@/components/organisms/CrispChat'));
  const features = getContext()?.features ?? [];

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <html {...getHtmlAttributes({ defaultColorScheme })} lang="fr">
      <head>
        <StartDsfr />
        <DsfrHead Link={Link} />
      </head>

      <body className="flex flex-col min-h-screen">
        <Providers features={features}>
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
          {crispWebsiteId && <CrispChat websiteId={crispWebsiteId} />}
        </Providers>
      </body>
    </html>
  );
}
