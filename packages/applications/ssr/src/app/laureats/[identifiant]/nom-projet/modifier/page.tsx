import type { Metadata } from 'next';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { getLauréatInfos } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { ModifierNomProjetPage } from './ModifierNomProjet.page';

export const metadata: Metadata = { title: 'Modifier le nom du projet' };

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.ModifierNomProjetUseCase>(
        'Lauréat.UseCase.ModifierNomProjet',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const lauréat = await getLauréatInfos(identifiantProjet.formatter());

      return (
        <ModifierNomProjetPage
          identifiantProjet={mapToPlainObject(lauréat.identifiantProjet)}
          nomProjet={lauréat.nomProjet}
        />
      );
    }),
  );
}
