import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import type { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { ModifierGestionnaireRéseauPage } from './ModifierGestionnaireRéseau.page';

export default async function Page(props0: IdentifiantParameter) {
  const params = await props0.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<GestionnaireRéseau.ModifierGestionnaireRéseauUseCase>(
        'Réseau.Gestionnaire.UseCase.ModifierGestionnaireRéseau',
      );

      const gestionnaireRéseau =
        await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
          type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
          data: {
            identifiantGestionnaireRéseau: decodeParameter(identifiant),
          },
        });

      if (Option.isNone(gestionnaireRéseau)) {
        return notFound();
      }

      const props = mapToPlainObject(gestionnaireRéseau);

      return (
        <ModifierGestionnaireRéseauPage
          identifiantGestionnaireRéseau={props.identifiantGestionnaireRéseau}
          contactEmail={props.contactEmail}
          raisonSociale={props.raisonSociale}
          aideSaisieRéférenceDossierRaccordement={props.aideSaisieRéférenceDossierRaccordement}
        />
      );
    }),
  );
}
