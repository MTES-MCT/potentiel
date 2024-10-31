import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';

import { ModifierGestionnaireRéseauPage } from '@/components/pages/réseau/gestionnaire/modifier/ModifierGestionnaireRéseau.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
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
  });
}
