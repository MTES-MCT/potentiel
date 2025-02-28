import { Metadata } from 'next';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { InviterPorteurPage } from '@/components/pages/utilisateur/inviter/InviterPorteur.page';
import { decodeParameter } from '@/utils/decodeParameter';

export const metadata: Metadata = {
  title: 'Inviter au projet - Potentiel',
  description: 'Inviter un utilisateur sur le projet',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));
    return <InviterPorteurPage identifiantProjet={mapToPlainObject(identifiantProjet)} />;
  });
}
