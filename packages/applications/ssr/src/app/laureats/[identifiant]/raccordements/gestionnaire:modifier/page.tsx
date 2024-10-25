import { mediator } from 'mediateur';
import { Metadata } from 'next';

import { GestionnaireRéseau, Raccordement } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import {
  ModifierGestionnaireRéseauRaccordementPage,
  ModifierGestionnaireRéseauRaccordementPageProps,
} from '@/components/pages/réseau/raccordement/modifier/modifierGestionnaireRéseauRaccordement/ModifierGestionnaireRéseauRaccordement.page';
import { récupérerProjet, vérifierQueLeProjetEstClassé } from '@/app/_helpers';

export const metadata: Metadata = {
  title: 'Modifier gestionnaire réseau - Potentiel',
  description: 'Formulaire de modification du gestionnaire de réseau du projet',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const projet = await récupérerProjet(identifiantProjet);

    await vérifierQueLeProjetEstClassé({
      statut: projet.statut,
      message:
        "Vous ne pouvez pas modifier le gestionnaire de réseau du raccordement d'un projet éliminé ou abandonné",
    });

    const listeGestionnaireRéseau =
      await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
        data: {},
      });

    const gestionnaireRéseau =
      await mediator.send<Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
        data: { identifiantProjetValue: identifiantProjet },
      });

    const props = mapToProps({
      listeGestionnaireRéseau,
      gestionnaireRéseau,
      identifiantProjet,
    });

    return (
      <ModifierGestionnaireRéseauRaccordementPage
        identifiantProjet={props.identifiantProjet}
        identifiantGestionnaireRéseauActuel={props.identifiantGestionnaireRéseauActuel}
        listeGestionnairesRéseau={props.listeGestionnairesRéseau}
      />
    );
  });
}

type MapToProps = (args: {
  listeGestionnaireRéseau: GestionnaireRéseau.ListerGestionnaireRéseauReadModel;
  gestionnaireRéseau: Option.Type<Raccordement.ConsulterGestionnaireRéseauRaccordementReadModel>;
  identifiantProjet: string;
}) => ModifierGestionnaireRéseauRaccordementPageProps;

const mapToProps: MapToProps = ({
  listeGestionnaireRéseau,
  gestionnaireRéseau,
  identifiantProjet,
}) => ({
  identifiantGestionnaireRéseauActuel: Option.match(gestionnaireRéseau)
    .some((gestionnaireRéseau) => gestionnaireRéseau.identifiantGestionnaireRéseau.formatter())
    .none(() => ''),
  listeGestionnairesRéseau: listeGestionnaireRéseau.items.map((gestionnaire) => ({
    identifiantGestionnaireRéseau: gestionnaire.identifiantGestionnaireRéseau.formatter(),
    raisonSociale: gestionnaire.raisonSociale,
    aideSaisieRéférenceDossierRaccordement: {
      format: gestionnaire.aideSaisieRéférenceDossierRaccordement.format,
      légende: gestionnaire.aideSaisieRéférenceDossierRaccordement.légende,
      expressionReguliere:
        gestionnaire.aideSaisieRéférenceDossierRaccordement.expressionReguliere.expression,
    },
  })),
  identifiantProjet,
});
