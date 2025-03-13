import { mediator } from 'mediateur';

import { ListerPorteursQuery } from '@potentiel-domain/utilisateur';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { PorteurListPage } from '@/components/pages/utilisateur/lister/PorteurList.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

type PageProps = IdentifiantParameter;

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const utilisateurs = await mediator.send<ListerPorteursQuery>({
      type: 'Utilisateur.Query.ListerPorteurs',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    return (
      <PorteurListPage
        identifiantProjet={identifiantProjet.formatter()}
        items={mapToPlainObject(utilisateurs.items)}
      />
    );
  });
}
