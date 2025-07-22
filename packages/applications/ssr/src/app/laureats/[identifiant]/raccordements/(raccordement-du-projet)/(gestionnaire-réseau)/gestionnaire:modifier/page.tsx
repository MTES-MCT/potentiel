import { mediator } from 'mediateur';
import { Metadata } from 'next';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { récupérerLauréatNonAbandonné } from '@/app/_helpers';

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
