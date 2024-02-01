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
import { Raccordement } from '@potentiel-domain/reseau';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import {
  ModifierDemandeComplèteRaccordementPage,
  ModifierDemandeComplèteRaccordementPageProps,
} from '@/components/pages/réseau/raccordement/modifier/modifierDemandeComplèteRaccordement/ModifierDemandeComplèteRaccordement.page';
import { withUtilisateur } from '@/utils/withUtilisateur';

export const metadata: Metadata = {
  title: 'Ajouter un dossier de raccordement - Potentiel',
  description: 'Formulaire de transmission de dossier de raccordement',
};

type PageProps = {
  params: {
    identifiant: IdentifiantParameter['params']['identifiant'];
    reference: string;
  };
};

export default async function Page({ params: { identifiant, reference } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);
      const referenceDossierRaccordement = decodeParameter(reference);

      const candidature = await mediator.send<ConsulterCandidatureQuery>({
        type: 'CONSULTER_CANDIDATURE_QUERY',
        data: { identifiantProjet },
      });

      const appelOffres = await mediator.send<ConsulterAppelOffreQuery>({
        type: 'CONSULTER_APPEL_OFFRE_QUERY',
        data: { identifiantAppelOffre: candidature.appelOffre },
      });

      const gestionnaireRéseau =
        await mediator.send<Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>({
          type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_RACCORDEMENT_QUERY',
          data: { identifiantProjetValue: identifiantProjet },
        });

      const dossierRaccordement =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'CONSULTER_DOSSIER_RACCORDEMENT_QUERY',
          data: {
            référenceDossierRaccordementValue: referenceDossierRaccordement,
            identifiantProjetValue: identifiantProjet,
          },
        });

      const props = mapToProps({
        candidature,
        appelOffres,
        gestionnaireRéseau,
        identifiantProjet,
        dossierRaccordement,
        utilisateur,
      });

      return <ModifierDemandeComplèteRaccordementPage {...props} />;
    }),
  );
}

type MapToProps = (args: {
  candidature: ConsulterCandidatureReadModel;
  appelOffres: ConsulterAppelOffreReadModel;
  gestionnaireRéseau: Raccordement.ConsulterGestionnaireRéseauRaccordementReadModel;
  dossierRaccordement: Raccordement.ConsulterDossierRaccordementReadModel;
  identifiantProjet: string;
  utilisateur: Utilisateur.ValueType;
}) => ModifierDemandeComplèteRaccordementPageProps;

const mapToProps: MapToProps = ({
  candidature,
  appelOffres,
  gestionnaireRéseau,
  dossierRaccordement,
  identifiantProjet,
  utilisateur,
}) => {
  return {
    projet: {
      ...candidature,
      identifiantProjet: identifiantProjet,
    },
    raccordement: {
      référence: dossierRaccordement.référence.référence,
      demandeComplèteRaccordement: {
        dateQualification:
          dossierRaccordement.demandeComplèteRaccordement.dateQualification?.formatter(),
        accuséRéception: dossierRaccordement.demandeComplèteRaccordement.accuséRéception?.format,
      },
      canEditRéférence:
        utilisateur.role.estÉgaleÀ(Role.admin) ||
        utilisateur.role.estÉgaleÀ(Role.dgecValidateur) ||
        (utilisateur.role.estÉgaleÀ(Role.dgecValidateur) && !dossierRaccordement.miseEnService),
    },
    delaiDemandeDeRaccordementEnMois: appelOffres.periodes.find(
      (periode) => (periode.id = candidature.période),
    )!.delaiDcrEnMois,
    gestionnaireRéseauActuel: {
      identifiantGestionnaireRéseau: gestionnaireRéseau.identifiantGestionnaireRéseau.formatter(),
      raisonSociale: gestionnaireRéseau.raisonSociale,
      ...(gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement && {
        aideSaisieRéférenceDossierRaccordement: {
          format: gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.format,
          légende: gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.légende,
          expressionReguliere:
            gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.expressionReguliere
              .expression,
        },
      }),
    },
  };
};
