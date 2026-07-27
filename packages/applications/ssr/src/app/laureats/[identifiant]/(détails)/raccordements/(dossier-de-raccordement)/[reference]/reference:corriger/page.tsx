import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getLauréatOrRedirect } from '../../../(raccordement-du-projet)/(détails)/_helpers';
import { CorrigerRéférenceDossierPage } from './CorrigerRéférenceDossierRaccordement.page';

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
      ).formatter();

      await getLauréatOrRedirect(identifiantProjet);
      const referenceDossierRaccordement = decodeParameter(reference);

      const gestionnaireRéseau =
        await mediator.send<Lauréat.Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
          data: { identifiantProjetValue: identifiantProjet },
        });

      if (Option.isNone(gestionnaireRéseau)) {
        return notFound();
      }

      const dossierRaccordement =
        await mediator.send<Lauréat.Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            référenceDossierRaccordementValue: referenceDossierRaccordement,
            identifiantProjetValue: identifiantProjet,
          },
        });

      if (Option.isNone(dossierRaccordement)) {
        return notFound();
      }

      return (
        <CorrigerRéférenceDossierPage
          identifiantProjet={identifiantProjet}
          gestionnaireRéseau={mapToPlainObject(gestionnaireRéseau)}
          dossierRaccordement={mapToPlainObject(dossierRaccordement)}
        />
      );
    }),
  );
}
