import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import {
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
} from '@potentiel-domain/candidature';
import { Role } from '@potentiel-domain/utilisateur';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { Raccordement, GestionnaireRéseau } from '@potentiel-domain/reseau';
import {
  DétailsRaccordementPage,
  DétailsRaccordementPageProps,
} from '@/components/pages/réseau/raccordement/détails/DétailsRaccordementPage';

type PageProps = IdentifiantParameter;

export const metadata: Metadata = {
  title: 'Raccordement du projet - Potentiel',
  description: 'Raccordement du projet',
};

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

      const candidature = await mediator.send<ConsulterCandidatureQuery>({
        type: 'CONSULTER_CANDIDATURE_QUERY',
        data: {
          identifiantProjet,
        },
      });

      const listeDossiersRaccordement =
        await mediator.send<Raccordement.ListerDossierRaccordementQuery>({
          type: 'LISTER_DOSSIER_RACCORDEMENT_QUERY',
          data: {
            identifiantProjetValue: identifiantProjet,
          },
        });

      const gestionnaireRéseau =
        await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
          type: 'CONSULTER_GESTIONNAIRE_RÉSEAU_QUERY',
          data: {
            identifiantGestionnaireRéseau:
              listeDossiersRaccordement.identifiantGestionnaireRéseau.formatter(),
          },
        });

      const props = mapToProps(
        utilisateur.role,
        candidature,
        gestionnaireRéseau,
        listeDossiersRaccordement,
      );

      return <DétailsRaccordementPage {...props} />;
    }),
  );
}

type MapToProps = (
  rôleUtilisateur: Role.ValueType,
  candidature: ConsulterCandidatureReadModel,
  gestionnaireRéseau: GestionnaireRéseau.ConsulterGestionnaireRéseauReadModel,
  listeDossiersRaccordement: Raccordement.ListerDossierRaccordementReadModel,
) => DétailsRaccordementPageProps;

const mapToProps: MapToProps = (
  rôleUtilisateur,
  candidature,
  gestionnaireRéseau,
  listeDossiersRaccordement,
) => {
  const identifiantProjet = listeDossiersRaccordement.identifiantProjet.formatter();
  const { aideSaisieRéférenceDossierRaccordement } = gestionnaireRéseau;

  return {
    projet: {
      ...candidature,
      identifiantProjet,
    },
    gestionnaireRéseau: {
      ...gestionnaireRéseau,
      identifiantGestionnaireRéseau: gestionnaireRéseau.identifiantGestionnaireRéseau.formatter(),
      aideSaisieRéférenceDossierRaccordement: {
        ...aideSaisieRéférenceDossierRaccordement,
        expressionReguliere: aideSaisieRéférenceDossierRaccordement.expressionReguliere.expression,
      },
      canEdit:
        rôleUtilisateur.estÉgaleÀ(Role.admin) ||
        rôleUtilisateur.estÉgaleÀ(Role.dgecValidateur) ||
        rôleUtilisateur.estÉgaleÀ(Role.porteur),
    },
    dossiers: listeDossiersRaccordement.dossiers.map((dossier) => {
      return {
        identifiantProjet,
        référence: dossier.référence.formatter(),
        demandeComplèteRaccordement: {
          canEdit:
            rôleUtilisateur.estÉgaleÀ(Role.admin) ||
            rôleUtilisateur.estÉgaleÀ(Role.dgecValidateur) ||
            rôleUtilisateur.estÉgaleÀ(Role.porteur),
          accuséRéception: dossier.demandeComplèteRaccordement.accuséRéception?.formatter(),
          dateQualification: dossier.demandeComplèteRaccordement.dateQualification?.formatter(),
        },
        propositionTechniqueEtFinancière: {
          canEdit:
            rôleUtilisateur.estÉgaleÀ(Role.admin) ||
            rôleUtilisateur.estÉgaleÀ(Role.dgecValidateur) ||
            rôleUtilisateur.estÉgaleÀ(Role.porteur),
          dateSignature: dossier.propositionTechniqueEtFinancière?.dateSignature.formatter(),
          propositionTechniqueEtFinancièreSignée:
            dossier.propositionTechniqueEtFinancière?.propositionTechniqueEtFinancièreSignée.formatter(),
        },
        miseEnService: {
          canEdit:
            rôleUtilisateur.estÉgaleÀ(Role.admin) ||
            rôleUtilisateur.estÉgaleÀ(Role.dgecValidateur) ||
            rôleUtilisateur.estÉgaleÀ(Role.porteur),
          dateMiseEnService: dossier.miseEnService?.dateMiseEnService?.formatter(),
        },
      };
    }),
  };
};
