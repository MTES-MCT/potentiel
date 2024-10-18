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
  title: 'Attribuer gestionnaire réseau - Potentiel',
  description: "Formulaire d'attribution du gestionnaire de réseau du projet",
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const projet = await récupérerProjet(identifiantProjet);

    // à voir si on peut attribuer quand même
    await vérifierQueLeProjetEstClassé({
      statut: projet.statut,
      message:
        "Vous ne pouvez pas attribuer le gestionnaire de réseau du raccordement d'un projet éliminé ou abandonné",
    });

    const gestionnairesRéseau =
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
      gestionnairesRéseau,
      gestionnaireRéseau,
      identifiantProjet,
    });

    // renvoyer vers une page d'attribuer, voir pour faire un composant unique ?
    // le formulaire une fois soumis doit renvoyer vers Routes.Raccordement.transmettre...
    return <ModifierGestionnaireRéseauRaccordementPage {...props} />;
  });
}

type MapToProps = (args: {
  gestionnairesRéseau: GestionnaireRéseau.ListerGestionnaireRéseauReadModel;
  gestionnaireRéseau: Option.Type<Raccordement.ConsulterGestionnaireRéseauRaccordementReadModel>;
  identifiantProjet: string;
}) => ModifierGestionnaireRéseauRaccordementPageProps;

const mapToProps: MapToProps = ({ gestionnairesRéseau, gestionnaireRéseau, identifiantProjet }) => {
  return {
    identifiantGestionnaireRéseauActuel: Option.match(gestionnaireRéseau)
      .some((gestionnaireRéseau) => gestionnaireRéseau.identifiantGestionnaireRéseau.formatter())
      .none(() => ''),
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
    identifiantProjet,
  };
};
