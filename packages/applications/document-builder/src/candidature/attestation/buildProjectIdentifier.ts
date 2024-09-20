import { createHmac } from 'crypto';

import { IdentifiantProjet } from '@potentiel-domain/common';

export const buildProjectIdentifier = (
  { appelOffre, famille, période, numéroCRE }: IdentifiantProjet.ValueType,
  potentielIdentifierSecret: string,
) => {
  const hmac = createHmac('sha256', potentielIdentifierSecret);
  hmac.update(appelOffre + période + famille + numéroCRE);
  const signature = hmac.digest('hex').substring(0, 3);

  return `${appelOffre}-P${période}${famille ? `-F${famille}` : ''}-${numéroCRE}-${signature}`;
};
