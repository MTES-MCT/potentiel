import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

import { DétailsÉliminéPage } from './DétailsÉliminé';

type PageProps = IdentifiantParameter;

export default async function Page(props: PageProps) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    return <DétailsÉliminéPage identifiantProjet={identifiantProjet.formatter()} />;
  });
}
