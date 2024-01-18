import './global.css';

import { DsfrHead } from '@codegouvfr/react-dsfr/next-appdir/DsfrHead';
import { getHtmlAttributes } from '@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes';
import Link from 'next/link';

import { Footer } from '@/components/organisms/Footer';
import { Header } from '@/components/organisms/Header';

import { defaultColorScheme } from './defaultColorScheme';
import Providers from './Providers';
import { StartDsfr } from './StartDsfr';

export default function RootLayout({ children }: { children: JSX.Element }) {
  //NOTE: The lang parameter is optional and defaults to "fr"
  return (
    <html {...getHtmlAttributes({ defaultColorScheme })}>
      <head>
        <StartDsfr />
        <DsfrHead Link={Link} />
      </head>
      <body className="flex flex-col min-h-screen">
        <Providers>
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
