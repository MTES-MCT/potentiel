'use client';

import { startReactDsfr } from '@codegouvfr/react-dsfr/next-appdir';

import { Link } from '@/components/atoms/LinkNoPrefetch';

import { defaultColorScheme } from './defaultColorScheme';

declare module '@codegouvfr/react-dsfr/next-appdir' {
  interface RegisterLink {
    Link: typeof Link;
  }
}

startReactDsfr({ defaultColorScheme, Link });

export function StartDsfr() {
  //Yes, leave null here.
  return null;
}
