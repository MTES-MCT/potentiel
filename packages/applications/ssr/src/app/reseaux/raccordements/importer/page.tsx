import { mediator } from 'mediateur';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import {
  ImporterDatesMiseEnServicePage,
  ImporterDatesMiseEnServicePageProps,
} from '@/components/pages/réseau/raccordement/importerDatesMiseEnService/ImporterDatesMiseEnService.page';
import { withUtilisateur } from '@/utils/withUtilisateur';

export default async function Page() {
  return withUtilisateur(async (utilisateur) => {
    const listeGestionnaireRéseau = await récupérerLesGestionnairesParUtilisateur(utilisateur);
    const listeGestionnairesRéseau = mapToProps(listeGestionnaireRéseau);

    // En attendant la mise en place du rôle GRD, celui par défaut est Enedis pour simplifier le travail de la DGEC
    const identifiantGestionnaireRéseauActuel: ImporterDatesMiseEnServicePageProps['identifiantGestionnaireRéseauActuel'] =
      listeGestionnairesRéseau.length === 1
        ? listeGestionnaireRéseau[0].identifiantGestionnaireRéseau.codeEIC
        : '17X100A100A0001A';

    return (
      <ImporterDatesMiseEnServicePage
        identifiantGestionnaireRéseauActuel={identifiantGestionnaireRéseauActuel}
        listeGestionnairesRéseau={listeGestionnairesRéseau}
      />
    );
  });
}

const récupérerLesGestionnairesParUtilisateur = async (user: Utilisateur.ValueType) => {
  if (Option.isSome(user.groupe) && user.groupe.type === 'GestionnairesRéseau') {
    const identifiantGestionnaireRéseau = user.groupe.nom;
    const gestionnaireRéseau =
      await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
        data: {
          identifiantGestionnaireRéseau,
        },
      });
    if (Option.isSome(gestionnaireRéseau)) {
      return [gestionnaireRéseau];
    }
    return [];
  }
  const listeGestionnaireRéseau =
    await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
      type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
      data: {},
    });
  return listeGestionnaireRéseau.items;
};

type MapToProps = (
  listeGestionnaireRéseau: GestionnaireRéseau.ListerGestionnaireRéseauReadModel['items'],
) => ImporterDatesMiseEnServicePageProps['listeGestionnairesRéseau'];

const mapToProps: MapToProps = (listeGestionnaireRéseau) => {
  return listeGestionnaireRéseau.map((gestionnaire) => ({
    identifiantGestionnaireRéseau: gestionnaire.identifiantGestionnaireRéseau.formatter(),
    raisonSociale: gestionnaire.raisonSociale,
    aideSaisieRéférenceDossierRaccordement: {
      format: gestionnaire.aideSaisieRéférenceDossierRaccordement.format,
      légende: gestionnaire.aideSaisieRéférenceDossierRaccordement.légende,
      expressionReguliere:
        gestionnaire.aideSaisieRéférenceDossierRaccordement.expressionReguliere.expression,
    },
  }));
};
