import { mediator } from 'mediateur';

import { Option } from '@potentiel/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { ModifierGestionnaireRéseauPage } from '@/components/pages/réseau/gestionnaire/modifier/ModifierGestionnaireRéseau.page';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { CustomErrorPage } from '@/components/pages/custom-error/CustomError.page';

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const gestionnaireRéseau =
      await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
        data: {
          identifiantGestionnaireRéseau: decodeParameter(identifiant),
        },
      });

    return Option.isNone(gestionnaireRéseau) ? (
      <CustomErrorPage statusCode="404" type="NotFoundError" />
    ) : (
      <ModifierGestionnaireRéseauPage {...mapToProps(gestionnaireRéseau)} />
    );
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
    expressionReguliere: expressionReguliere.formatter(),
  };
};
