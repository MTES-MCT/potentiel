import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

import { DétailsÉliminéPage } from './DétailsÉliminé';

type PageProps = IdentifiantParameter;

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    return <DétailsÉliminéPage identifiantProjet={identifiantProjet.formatter()} />;
  });
}
