import { mediator } from 'mediateur';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';

import { CustomErrorPage } from '@/components/pages/custom-error/CustomError.page';
import { ModifierGestionnaireRéseauPage } from '@/components/pages/réseau/gestionnaire/modifier/ModifierGestionnaireRéseau.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const gestionnaireRéseau =
      await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
        data: {
          identifiantGestionnaireRéseau: decodeParameter(identifiant),
        },
      });

    return Option.match(gestionnaireRéseau)
      .some((grd) => <ModifierGestionnaireRéseauPage {...grd} />)
      .none(() => <CustomErrorPage statusCode="404" type="NotFoundError" />);
  });
}
