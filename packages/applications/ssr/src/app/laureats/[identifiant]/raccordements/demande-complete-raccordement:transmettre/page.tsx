import { mediator } from 'mediateur';
import { Metadata } from 'next';

import {
  ConsulterAppelOffreQuery,
  ConsulterAppelOffreReadModel,
} from '@potentiel-domain/appel-offre';
import {
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
} from '@potentiel-domain/candidature';
import { NotFoundError } from '@potentiel-domain/core';
import { GestionnaireRéseau, Raccordement } from '@potentiel-domain/reseau';

import {
  TransmettreDemandeComplèteRaccordementPage,
  TransmettreDemandeComplèteRaccordementProps,
} from '@/components/pages/réseau/raccordement/transmettre/transmettreDemandeComplèteRaccordement/TransmettreDemandeComplèteRaccordement.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

export const metadata: Metadata = {
  title: 'Ajouter un dossier de raccordement - Potentiel',
  description: 'Formulaire de transmission de dossier de raccordement',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'CONSULTER_CANDIDATURE_QUERY',
      data: { identifiantProjet },
    });

    const appelOffres = await mediator.send<ConsulterAppelOffreQuery>({
      type: 'CONSULTER_APPEL_OFFRE_QUERY',
      data: { identifiantAppelOffre: candidature.appelOffre },
    });

    const gestionnairesRéseau =
      await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
        type: 'LISTER_GESTIONNAIRE_RÉSEAU_QUERY',
        data: { pagination: { itemsPerPage: 1000, page: 1 } },
      });

    if (gestionnairesRéseau.items.length === 0) {
      throw new NotFoundError('Aucun gestionnaire de réseau à lister');
    }

    const gestionnaire =
      await mediator.send<Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>({
        type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_RACCORDEMENT_QUERY',
        data: { identifiantProjetValue: identifiantProjet },
      });

    const props: TransmettreDemandeComplèteRaccordementProps = mapToProps({
      gestionnairesRéseau,
      candidature,
      appelOffres,
      gestionnaireRéseau: gestionnaire,
      identifiantProjet,
    });

    return <TransmettreDemandeComplèteRaccordementPage {...props} />;
  });
}

type MapToProps = (args: {
  gestionnairesRéseau: GestionnaireRéseau.ListerGestionnaireRéseauReadModel;
  candidature: ConsulterCandidatureReadModel;
  appelOffres: ConsulterAppelOffreReadModel;
  gestionnaireRéseau?: Raccordement.ConsulterGestionnaireRéseauRaccordementReadModel;
  identifiantProjet: string;
}) => TransmettreDemandeComplèteRaccordementProps;

const mapToProps: MapToProps = ({
  gestionnairesRéseau,
  candidature,
  appelOffres,
  gestionnaireRéseau,
  identifiantProjet,
}) => {
  return {
    delaiDemandeDeRaccordementEnMois: appelOffres.periodes.find(
      (periode) => (periode.id = candidature.période),
    )!.delaiDcrEnMois,
    ...(gestionnaireRéseau && {
      identifiantGestionnaireRéseauActuel: gestionnaireRéseau.identifiantGestionnaireRéseau.codeEIC,
    }),
    listeGestionnairesRéseau: gestionnairesRéseau.items.map((gestionnaire) => ({
      identifiantGestionnaireRéseau: gestionnaire.identifiantGestionnaireRéseau.codeEIC,
      codeEIC: gestionnaire.identifiantGestionnaireRéseau.codeEIC,
      raisonSociale: gestionnaire.raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        format: gestionnaire.aideSaisieRéférenceDossierRaccordement.format,
        légende: gestionnaire.aideSaisieRéférenceDossierRaccordement.légende,
        expressionReguliere:
          gestionnaire.aideSaisieRéférenceDossierRaccordement.expressionReguliere.expression,
      },
    })),
    projet: {
      ...candidature,
      identifiantProjet: identifiantProjet,
    },
  };
};
