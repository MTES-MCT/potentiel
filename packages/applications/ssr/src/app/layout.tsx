import './global.css';

import { DsfrHead } from '@codegouvfr/react-dsfr/next-appdir/DsfrHead';
import { getHtmlAttributes } from '@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes';
import { StartDsfr } from './StartDsfr';
import { defaultColorScheme } from './defaultColorScheme';
import Link from 'next/link';
import Providers from './Providers';
import { Layout } from '@/components/templates/Layout';

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
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
