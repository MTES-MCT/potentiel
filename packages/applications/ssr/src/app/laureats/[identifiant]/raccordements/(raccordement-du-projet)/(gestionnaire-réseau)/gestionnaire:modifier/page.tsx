import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import type { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { récupérerLauréatNonAbandonné } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { ModifierGestionnaireRéseauRaccordementPage } from './ModifierGestionnaireRéseauRaccordement.page';

export const metadata: Metadata = {
  title: 'Modifier gestionnaire réseau - Potentiel',
  description: 'Formulaire de modification du gestionnaire de réseau du projet',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    await récupérerLauréatNonAbandonné(identifiantProjet.formatter());

    const gestionnairesRéseau =
      await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
        data: {},
      });

    const gestionnaireRéseau =
      await mediator.send<Lauréat.Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
        data: { identifiantProjetValue: identifiantProjet.formatter() },
      });

    return (
      <ModifierGestionnaireRéseauRaccordementPage
        gestionnaireRéseauActuel={mapToPlainObject(gestionnaireRéseau)}
        listeGestionnairesRéseau={mapToPlainObject(gestionnairesRéseau.items)}
        identifiantProjet={mapToPlainObject(identifiantProjet)}
      />
    );
  });
}
