import FaviconPng from '@codegouvfr/react-dsfr/dsfr/favicon/android-chrome-192x192.png';
import {
  createGetHtmlAttributes,
  DsfrHeadBase,
  type DsfrHeadProps,
} from '@codegouvfr/react-dsfr/next-app-router/server-only-index';

import { Link } from '@/components/atoms/LinkNoPrefetch';
import { defaultColorScheme } from './defaultColorScheme';

export const { getHtmlAttributes } = createGetHtmlAttributes({
  defaultColorScheme,
});

export function DsfrHead(props: DsfrHeadProps) {
  return (
    <>
      <link rel="icon" href={FaviconPng as unknown as string} type="image/png" sizes="192x192" />
      <DsfrHeadBase Link={Link} {...props} />
    </>
  );
}
