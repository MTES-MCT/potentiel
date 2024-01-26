import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { ModifierGestionnaireRéseauPage } from '@/components/pages/réseau/gestionnaire/ModifierGestionnaireRéseauPage';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { mediator } from 'mediateur';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { decodeParameter } from '@/utils/decodeParameter';

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
}: GestionnaireRéseau.ConsulterGestionnaireRéseauReadModel) => {
  return {
    identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
    raisonSociale,
    format,
    légende,
    expressionReguliere: expressionReguliere.expression,
  };
};
