import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import {
  ConsulterCandidatureQuery,
  ConsulterCandidatureReadModel,
} from '@potentiel-domain/candidature';
import { GestionnaireRéseau, Raccordement } from '@potentiel-domain/reseau';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { AucunDossierDeRaccordementPage } from '@/components/pages/réseau/raccordement/détails/AucunDossierDeRaccordement.page';
import {
  DétailsRaccordementPage,
  DétailsRaccordementPageProps,
} from '@/components/pages/réseau/raccordement/détails/DétailsRaccordement.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';

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

      const projet = {
        ...candidature,
        identifiantProjet,
      };

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

      if (listeDossiersRaccordement.dossiers.length === 0) {
        return <AucunDossierDeRaccordementPage projet={projet} />;
      }

      const props = mapToProps({
        rôleUtilisateur: utilisateur.role,
        candidature,
        identifiantProjet,
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
  identifiantProjet: string;
  gestionnaireRéseau: Option.Type<GestionnaireRéseau.ConsulterGestionnaireRéseauReadModel>;
  listeDossiersRaccordement: Raccordement.ConsulterRaccordementReadModel;
}) => DétailsRaccordementPageProps;

const mapToProps: MapToProps = ({
  rôleUtilisateur,
  candidature,
  identifiantProjet,
  gestionnaireRéseau,
  listeDossiersRaccordement,
}) => ({
  projet: {
    ...candidature,
    identifiantProjet,
  },
  gestionnaireRéseau: Option.isNone(gestionnaireRéseau)
    ? undefined
    : {
        ...gestionnaireRéseau,
        identifiantGestionnaireRéseau: gestionnaireRéseau.identifiantGestionnaireRéseau.formatter(),
        aideSaisieRéférenceDossierRaccordement: {
          ...gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement,
          expressionReguliere:
            gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.expressionReguliere.formatter(),
        },
        contactEmail: gestionnaireRéseau.contactEmail,
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
          rôleUtilisateur.estÉgaleÀ(Role.admin) || rôleUtilisateur.estÉgaleÀ(Role.dgecValidateur),
        dateMiseEnService: dossier.miseEnService?.dateMiseEnService?.formatter(),
      },
    };
  }),
});
