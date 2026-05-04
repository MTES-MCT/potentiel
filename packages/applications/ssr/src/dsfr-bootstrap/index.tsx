'use client';
import {
  DsfrProviderBase,
  type DsfrProviderProps,
  StartDsfrOnHydration,
} from '@codegouvfr/react-dsfr/next-app-router';

import { defaultColorScheme } from './defaultColorScheme';
import { Link } from '@/components/atoms/LinkNoPrefetch';

declare module '@codegouvfr/react-dsfr/next-app-router' {
  interface RegisterLink {
    Link: typeof Link;
  }
}

export function DsfrProvider(props: DsfrProviderProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <DsfrProviderBase defaultColorScheme={defaultColorScheme} Link={Link} {...props} />;
}

export { StartDsfrOnHydration };
