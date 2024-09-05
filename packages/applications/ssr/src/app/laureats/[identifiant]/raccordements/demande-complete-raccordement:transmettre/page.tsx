import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { GestionnaireRéseau, Raccordement } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';

import {
  TransmettreDemandeComplèteRaccordementPage,
  TransmettreDemandeComplèteRaccordementPageProps,
} from '@/components/pages/réseau/raccordement/transmettre/transmettreDemandeComplèteRaccordement/TransmettreDemandeComplèteRaccordement.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import {
  récupérerProjet,
  vérifierQueLeProjetNestPasAbandonné,
  vérifierQueLeProjetNestPasÉliminé,
} from '@/app/_helpers';

export const metadata: Metadata = {
  title: 'Ajouter un dossier de raccordement - Potentiel',
  description: 'Formulaire de transmission de dossier de raccordement',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const decodedIdentifiant = decodeParameter(identifiant);

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodedIdentifiant);

    const projet = await récupérerProjet(identifiantProjet.formatter());

    Promise.all([
      vérifierQueLeProjetNestPasAbandonné(identifiantProjet.formatter(), projet.statut),
      vérifierQueLeProjetNestPasÉliminé(identifiantProjet.formatter(), projet.statut),
    ]);

    const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: identifiantProjet.appelOffre },
    });

    if (Option.isNone(appelOffre)) {
      return notFound();
    }

    const gestionnairesRéseau =
      await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
        data: {},
      });

    const gestionnaire =
      await mediator.send<Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
        data: { identifiantProjetValue: identifiantProjet.formatter() },
      });

    const props: TransmettreDemandeComplèteRaccordementPageProps = mapToProps({
      gestionnairesRéseau,
      appelOffre,
      gestionnaireRéseau: gestionnaire,
      identifiantProjet,
    });

    return <TransmettreDemandeComplèteRaccordementPage {...props} />;
  });
}

type MapToProps = (args: {
  gestionnairesRéseau: GestionnaireRéseau.ListerGestionnaireRéseauReadModel;
  appelOffre: AppelOffre.ConsulterAppelOffreReadModel;
  gestionnaireRéseau: Option.Type<Raccordement.ConsulterGestionnaireRéseauRaccordementReadModel>;
  identifiantProjet: IdentifiantProjet.ValueType;
}) => TransmettreDemandeComplèteRaccordementPageProps;

const mapToProps: MapToProps = ({
  gestionnairesRéseau,
  appelOffre,
  gestionnaireRéseau,
  identifiantProjet,
}) => {
  return {
    delaiDemandeDeRaccordementEnMois: appelOffre.periodes.find(
      (periode) => (periode.id = identifiantProjet.période),
    )!.delaiDcrEnMois,
    ...(Option.isSome(gestionnaireRéseau) && {
      identifiantGestionnaireRéseauActuel:
        gestionnaireRéseau.identifiantGestionnaireRéseau.formatter(),
    }),
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
    identifiantProjet: identifiantProjet.formatter(),
  };
};
