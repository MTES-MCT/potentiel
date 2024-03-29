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
  title: 'Modifier un dossier de raccordement - Potentiel',
  description: `Formulaire de modification d'un dossier de raccordement`,
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
        type: 'Candidature.Query.ConsulterCandidature',
        data: { identifiantProjet },
      });

      const appelOffre = await mediator.send<ConsulterAppelOffreQuery>({
        type: 'AppelOffre.Query.ConsulterAppelOffre',
        data: { identifiantAppelOffre: candidature.appelOffre },
      });

      const gestionnaireRéseau =
        await mediator.send<Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>({
          type: 'Réseau.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
          data: { identifiantProjetValue: identifiantProjet },
        });

      const dossierRaccordement =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            référenceDossierRaccordementValue: referenceDossierRaccordement,
            identifiantProjetValue: identifiantProjet,
          },
        });

      const props = mapToProps({
        candidature,
        appelOffre,
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
  appelOffre: ConsulterAppelOffreReadModel;
  gestionnaireRéseau: Raccordement.ConsulterGestionnaireRéseauRaccordementReadModel;
  dossierRaccordement: Raccordement.ConsulterDossierRaccordementReadModel;
  identifiantProjet: string;
  utilisateur: Utilisateur.ValueType;
}) => ModifierDemandeComplèteRaccordementPageProps;

const mapToProps: MapToProps = ({
  candidature,
  appelOffre,
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
        accuséRéception:
          dossierRaccordement.demandeComplèteRaccordement.accuséRéception?.formatter(),
      },
      canEditRéférence:
        utilisateur.role.estÉgaleÀ(Role.admin) ||
        utilisateur.role.estÉgaleÀ(Role.dgecValidateur) ||
        (utilisateur.role.estÉgaleÀ(Role.porteur) && !dossierRaccordement.miseEnService),
    },
    delaiDemandeDeRaccordementEnMois: appelOffre.periodes.find(
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
