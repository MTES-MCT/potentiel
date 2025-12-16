import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

import { TableauDeBordPage } from './TableauDeBord.page';
import { checkFeatureFlag } from './_helpers/checkFeatureFlag';

type PageProps = IdentifiantParameter & {
  searchParams?: Record<string, string>;
};

export default async function Page({ params: { identifiant }, searchParams }: PageProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    checkFeatureFlag(identifiantProjet, searchParams);

    return <TableauDeBordPage identifiantProjet={identifiantProjet.formatter()} />;
  });
}
