import { Metadata } from 'next';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { decodeParameter } from '@/utils/decodeParameter';

import { getLauréatInfos } from '../../_helpers';

import { ModifierSiteDeProductionPage } from './ModifierSiteDeProduction.page';

export const metadata: Metadata = {
  title: `Modification de l'adresse du projet - Potentiel`,
  description: `Modification de l'adresse du projet`,
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);
      const lauréat = await getLauréatInfos(
        IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
      );
      return (
        <ModifierSiteDeProductionPage
          lauréat={mapToPlainObject(lauréat)}
          rôle={mapToPlainObject(utilisateur.rôle)}
        />
      );
    }),
  );
}
