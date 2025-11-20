import {
  DsfrHeadBase,
  type DsfrHeadProps,
  createGetHtmlAttributes,
} from '@codegouvfr/react-dsfr/next-app-router/server-only-index';
import Link from 'next/link';

import { defaultColorScheme } from './defaultColorScheme';

export const { getHtmlAttributes } = createGetHtmlAttributes({ defaultColorScheme });

export function DsfrHead(props: DsfrHeadProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <DsfrHeadBase Link={Link} {...props} />;
}
