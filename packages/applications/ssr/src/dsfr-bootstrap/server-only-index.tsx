import {
  DsfrHeadBase,
  type DsfrHeadProps,
  createGetHtmlAttributes,
} from '@codegouvfr/react-dsfr/next-app-router/server-only-index';

import { defaultColorScheme } from './defaultColorScheme';
import { Link } from '@/components/atoms/LinkNoPrefetch';

export const { getHtmlAttributes } = createGetHtmlAttributes({ defaultColorScheme });

export function DsfrHead(props: DsfrHeadProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <DsfrHeadBase Link={Link} {...props} />;
}
