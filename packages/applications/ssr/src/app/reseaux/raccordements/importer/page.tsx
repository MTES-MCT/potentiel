import { mediator } from 'mediateur';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import {
  ImporterDatesMiseEnServicePage,
  ImporterDatesMiseEnServicePageProps,
} from '@/components/pages/réseau/raccordement/importerDatesMiseEnService/ImporterDatesMiseEnService.page';

export default async function Page() {
  const listeGestionnaireRéseau =
    await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
      type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
      data: {},
    });

  const listeGestionnairesRéseau = mapToProps(listeGestionnaireRéseau);

  // En attendant la mise en place du rôle GRD, celui par défaut est Enedis pour simplifier le travail de la DGEC
  const gestionnaireRéseau: ImporterDatesMiseEnServicePageProps['identifiantGestionnaireRéseauActuel'] =
    '17X100A100A0001A';

  return (
    <ImporterDatesMiseEnServicePage
      identifiantGestionnaireRéseauActuel={gestionnaireRéseau}
      listeGestionnairesRéseau={listeGestionnairesRéseau}
    />
  );
}

type MapToProps = (
  listeGestionnaireRéseau: GestionnaireRéseau.ListerGestionnaireRéseauReadModel,
) => ImporterDatesMiseEnServicePageProps['listeGestionnairesRéseau'];

const mapToProps: MapToProps = (listeGestionnaireRéseau) => {
  return listeGestionnaireRéseau.items.map((gestionnaire) => ({
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
