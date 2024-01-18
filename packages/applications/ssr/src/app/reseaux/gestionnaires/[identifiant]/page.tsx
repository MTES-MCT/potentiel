import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { mediator } from 'mediateur';

import { ModifierGestionnaireRéseauPage } from '@/components/pages/réseau/gestionnaire/ModifierGestionnaireRéseauPage';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const gestionnaireRéseau =
      await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
        type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
        data: {
          identifiantGestionnaireRéseau: decodeParameter(identifiant),
        },
      });

    return <ModifierGestionnaireRéseauPage {...mapToProps(gestionnaireRéseau)} />;
  });
}

const mapToProps = ({
  aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
  identifiantGestionnaireRéseau,
  raisonSociale,
}: GestionnaireRéseau.ConsulterGetionnaireRéseauReadModel) => {
  return {
    identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
    raisonSociale,
    format,
    légende,
    expressionReguliere: expressionReguliere.expression,
  };
};
