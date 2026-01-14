import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { getTâches } from './_helpers/getTâches';
import { TâchesPage } from './Tâches.page';

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

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
