import './global.css';

import { SkipLinks } from '@codegouvfr/react-dsfr/SkipLinks';
import { Metadata } from 'next';
import dynamicImport from 'next/dynamic';

import { getContext } from '@potentiel-applications/request-context';

import { Footer } from '@/components/organisms/Footer';
import { Header } from '@/components/organisms/header/Header';
import { getHtmlAttributes, DsfrHead } from '@/dsfr-bootstrap/server-only-index';
import { StartDsfrOnHydration } from '@/dsfr-bootstrap';

import Providers from './Providers';

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
    <html {...getHtmlAttributes({ lang: 'fr' })}>
      <head>
        <DsfrHead
          preloadFonts={['Marianne-Light', 'Marianne-Regular', 'Marianne-Medium', 'Marianne-Bold']}
        />
      </head>

      <body className="flex flex-col min-h-screen">
        {/*
          NB : la documentation (https://react-dsfr.codegouv.studio/) indique que ce composant doit être placé dans chaque page, et non dans le layout.
          Cette issue https://github.com/codegouvfr/react-dsfr/issues/305#issuecomment-2758317047 explique que : 
            - Until <StartDsfrOnHydration /> is hydrated, DSFR elements remain non-interactive
            - Once it is hydrated, you can no longer stream in new HTML chunks conaining DSFR components (i.e. no server components below this point)
          Cependant, aucune différence n'est visible et le SSR semble bien fonctionner.
        */}
        <StartDsfrOnHydration />

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
