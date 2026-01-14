import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { checkFeatureFlag } from '../_helpers/checkFeatureFlag';

import { getTâches } from './_helpers/getTâches';
import { TâchesPage } from './Tâches.page';

type PageProps = IdentifiantParameter & {
  searchParams?: Record<string, string>;
};

export default async function Page({ params: { identifiant }, searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      checkFeatureFlag(identifiantProjet, searchParams);

      const tâches = await getTâches(
        identifiantProjet.formatter(),
        utilisateur.identifiantUtilisateur.email,
      );

      return (
        <TâchesPage
          tâches={mapToPlainObject(tâches)}
          utilisateurEstPorteur={utilisateur.estPorteur()}
        />
      );
    }),
  );
}
