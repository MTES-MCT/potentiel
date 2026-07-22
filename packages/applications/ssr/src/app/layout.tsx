import { SkipLinks } from '@codegouvfr/react-dsfr/SkipLinks';
import type { Metadata } from 'next';
import dynamicImport from 'next/dynamic';

import { Footer } from '@/components/organisms/Footer';
import { Header } from '@/components/organisms/header/Header';
import { StartDsfrOnHydration } from '@/dsfr-bootstrap';
import { DsfrHead, getHtmlAttributes } from '@/dsfr-bootstrap/server-only-index';

// Tailwind import must happen after DSFR import.
import './global.css';

import Badge from '@codegouvfr/react-dsfr/Badge';
import { headers } from 'next/headers';

import { getSessionUser } from '@/auth/getSessionUser';
import { featureFlag } from './_helpers/getFeatureFlag';
import Providers from './Providers';

export const metadata: Metadata = {
  title: {
    template: '%s | Potentiel',
    default: 'Potentiel',
  },
  description: "Facilite le parcours des producteurs d'énergies renouvelables électriques",
};

export const dynamic = 'force-dynamic';

const EnvBadge = () => {
  if (!process.env.APPLICATION_STAGE) {
    return null;
  }

  const className = 'fixed left-5 top-5 z-50';

  if (process.env.APPLICATION_STAGE === 'production') {
    return (
      <Badge className={className} severity="warning">
        PROD
      </Badge>
    );
  }

  return (
    <Badge className={className} severity="info">
      {process.env.APPLICATION_STAGE.toUpperCase()}
    </Badge>
  );
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const crispWebsiteId = process.env.CRISP_WEBSITE_ID;
  const CrispChat = dynamicImport(() => import('@/components/organisms/CrispChat'));
  const utilisateur = await getSessionUser({ headers: await headers() });

  return (
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

        {utilisateur?.rôle.estAdmin() && <EnvBadge />}

        <Providers features={featureFlag}>
          <SkipLinks
            links={[
              {
                anchor: '#contenu',
                label: 'Accéder au contenu',
              },
              {
                anchor: '#main-navigation',
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
