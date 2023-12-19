import { getUser } from '@/utils/getUtilisateur';
import { redirect } from 'next/navigation';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { ModifierGestionnaireRéseauPage } from '@/components/pages/réseau/gestionnaire/ModifierGestionnaireRéseauPage';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { mediator } from 'mediateur';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const utilisateur = await getUser();
    if (!utilisateur) {
      redirect('/login.html');
    }

    const gestionnaireRéseau =
      await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
        type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
        data: {
          identifiantGestionnaireRéseau: identifiant,
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
    expressionReguliere: expressionReguliere || '',
  };
};
