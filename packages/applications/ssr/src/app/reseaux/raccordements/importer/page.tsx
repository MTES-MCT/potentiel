import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import {
  ImporterDatesMiseEnServicePage,
  ImporterDatesMiseEnServicePageProps,
} from '@/components/pages/réseau/raccordement/importerDatesMiseEnService/ImporterDatesMiseEnService.page';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { récupérerLesGestionnairesParUtilisateur } from '../_helpers/récupérerLesGestionnairesParUtilisateur';

export default async function Page() {
  return withUtilisateur(async (utilisateur) => {
    const listeGestionnaireRéseau = await récupérerLesGestionnairesParUtilisateur(utilisateur);
    const listeGestionnairesRéseau = mapToProps(listeGestionnaireRéseau);

    // En attendant l'intégration automatique pour Enedis, les admins feront l'update manuel,
    // c'est pourquoi on on met l'identifiant Enedis par défaut
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
