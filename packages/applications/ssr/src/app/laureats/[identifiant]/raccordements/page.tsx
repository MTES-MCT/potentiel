import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { Option } from '@potentiel/monads';
import {
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
} from '@potentiel-domain/candidature';
import { Role } from '@potentiel-domain/utilisateur';
import { Raccordement, GestionnaireRéseau } from '@potentiel-domain/reseau';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  DétailsRaccordementPage,
  DétailsRaccordementPageProps,
} from '@/components/pages/réseau/raccordement/détails/DétailsRaccordement.page';

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
        type: 'Candidature.Query.ConsulterCandidature',
        data: {
          identifiantProjet,
        },
      });

      const listeDossiersRaccordement =
        await mediator.send<Raccordement.ConsulterRaccordementQuery>({
          type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
          data: {
            identifiantProjetValue: identifiantProjet,
          },
        });

      const gestionnaireRéseau =
        await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
          type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
          data: {
            identifiantGestionnaireRéseau:
              listeDossiersRaccordement.identifiantGestionnaireRéseau.formatter(),
          },
        });

      const props = mapToProps({
        rôleUtilisateur: utilisateur.role,
        candidature,
        gestionnaireRéseau,
        listeDossiersRaccordement,
      });

      return <DétailsRaccordementPage {...props} />;
    }),
  );
}

type MapToProps = (args: {
  rôleUtilisateur: Role.ValueType;
  candidature: ConsulterCandidatureReadModel;
  gestionnaireRéseau: Option.Type<GestionnaireRéseau.ConsulterGestionnaireRéseauReadModel>;
  listeDossiersRaccordement: Raccordement.ConsulterRaccordementReadModel;
}) => DétailsRaccordementPageProps;

const mapToProps: MapToProps = ({
  rôleUtilisateur,
  candidature,
  gestionnaireRéseau,
  listeDossiersRaccordement,
}) => {
  const identifiantProjet = listeDossiersRaccordement.identifiantProjet.formatter();

  return {
    projet: {
      ...candidature,
      identifiantProjet,
    },
    ...(Option.isSome(gestionnaireRéseau) && {
      gestionnaireRéseau: {
        ...gestionnaireRéseau,
        identifiantGestionnaireRéseau: gestionnaireRéseau.identifiantGestionnaireRéseau.formatter(),
        aideSaisieRéférenceDossierRaccordement: {
          ...gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement,
          expressionReguliere:
            gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.expressionReguliere
              .expression,
        },
        canEdit:
          rôleUtilisateur.estÉgaleÀ(Role.admin) ||
          rôleUtilisateur.estÉgaleÀ(Role.dgecValidateur) ||
          rôleUtilisateur.estÉgaleÀ(Role.porteur),
      },
    }),
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
            rôleUtilisateur.estÉgaleÀ(Role.admin) || rôleUtilisateur.estÉgaleÀ(Role.dgecValidateur),
          dateMiseEnService: dossier.miseEnService?.dateMiseEnService?.formatter(),
        },
      };
    }),
  };
};
