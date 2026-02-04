import { Metadata } from 'next';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { getLauréatInfos } from '../../_helpers';

import { ModifierNomProjetPage } from './ModifierNomProjet.page';

export const metadata: Metadata = {
  title: 'Modifier le nom du projet - Potentiel',
  description: 'Formulaire de modification du nom du projet',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
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
