import { mediator } from 'mediateur';
import { Metadata } from 'next';

import {
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
} from '@potentiel-domain/candidature';
import { NotFoundError } from '@potentiel-domain/core';
import { GestionnaireRéseau, Raccordement } from '@potentiel-domain/reseau';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import {
  ModifierGestionnaireRéseauRaccordementPage,
  ModifierGestionnaireRéseauRaccordementPageProps,
} from '@/components/pages/réseau/raccordement/modifier/modifierGestionnaireRéseauRaccordement/ModifierGestionnaireRéseauRaccordement.page';

export const metadata: Metadata = {
  title: 'Modifier gestionnaire réseau - Potentiel',
  description: 'Formulaire de modification du gestionnaire de réseau du projet',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'CONSULTER_CANDIDATURE_QUERY',
      data: { identifiantProjet },
    });

    const gestionnairesRéseau =
      await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
        type: 'LISTER_GESTIONNAIRE_RÉSEAU_QUERY',
        data: { pagination: { itemsPerPage: 1000, page: 1 } },
      });

    if (gestionnairesRéseau.items.length === 0) {
      throw new NotFoundError('Aucun gestionnaire de réseau à lister');
    }

    const gestionnaireRéseau =
      await mediator.send<Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>({
        type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_RACCORDEMENT_QUERY',
        data: { identifiantProjetValue: identifiantProjet },
      });

    const props = mapToProps({
      gestionnairesRéseau,
      candidature,
      gestionnaireRéseau,
      identifiantProjet,
    });

    return <ModifierGestionnaireRéseauRaccordementPage {...props} />;
  });
}

type MapToProps = (args: {
  gestionnairesRéseau: GestionnaireRéseau.ListerGestionnaireRéseauReadModel;
  candidature: ConsulterCandidatureReadModel;
  gestionnaireRéseau: Raccordement.ConsulterGestionnaireRéseauRaccordementReadModel;
  identifiantProjet: string;
}) => ModifierGestionnaireRéseauRaccordementPageProps;

const mapToProps: MapToProps = ({
  gestionnairesRéseau,
  candidature,
  gestionnaireRéseau,
  identifiantProjet,
}) => {
  return {
    identifiantGestionnaireRéseauActuel:
      gestionnaireRéseau.identifiantGestionnaireRéseau.formatter(),
    listeGestionnairesRéseau: gestionnairesRéseau.items.map((gestionnaire) => ({
      identifiantGestionnaireRéseau: gestionnaire.identifiantGestionnaireRéseau.formatter(),
      raisonSociale: gestionnaire.raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        format: gestionnaire.aideSaisieRéférenceDossierRaccordement.format,
        légende: gestionnaire.aideSaisieRéférenceDossierRaccordement.légende,
        expressionReguliere:
          gestionnaire.aideSaisieRéférenceDossierRaccordement.expressionReguliere.expression,
      },
    })),
    projet: {
      ...candidature,
      identifiantProjet: identifiantProjet,
    },
  };
};
