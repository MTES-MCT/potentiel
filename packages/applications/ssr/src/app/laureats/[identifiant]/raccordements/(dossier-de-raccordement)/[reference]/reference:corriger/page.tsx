import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { getLauréat } from '@/app/laureats/[identifiant]/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { vérifierSiModificationRaccordementPossible } from '../../../(raccordement-du-projet)/(détails)/_helpers';
import { CorrigerRéférenceDossierPage } from './CorrigerRéférenceDossier.page';

export const metadata: Metadata = {
  title: 'Corriger une référence de dossier de raccordement',
};

export default async function Page(
  props: PageProps<'/laureats/[identifiant]/raccordements/[reference]/reference:corriger'>,
) {
  const { identifiant, reference } = await props.params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Raccordement.ModifierRéférenceDossierRaccordementUseCase>(
        'Lauréat.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );
      const lauréat = await getLauréat(identifiantProjet.formatter());
      const peutModifierRaccordement = vérifierSiModificationRaccordementPossible(lauréat);
      if (!peutModifierRaccordement) {
        return redirect(Routes.Lauréat.détails.tableauDeBord(identifiantProjet.formatter()));
      }

      const referenceDossierRaccordement = decodeParameter(reference);

      const gestionnaireRéseau =
        await mediator.send<Lauréat.Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
          data: { identifiantProjetValue: identifiantProjet.formatter() },
        });

      if (Option.isNone(gestionnaireRéseau)) {
        return notFound();
      }

      const dossierRaccordement =
        await mediator.send<Lauréat.Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            référenceDossierRaccordementValue: referenceDossierRaccordement,
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

      if (Option.isNone(dossierRaccordement)) {
        return notFound();
      }

      return (
        <CorrigerRéférenceDossierPage
          identifiantProjet={identifiantProjet.formatter()}
          gestionnaireRéseau={mapToPlainObject(gestionnaireRéseau)}
          dossierRaccordement={mapToPlainObject(dossierRaccordement)}
        />
      );
    }),
  );
}
