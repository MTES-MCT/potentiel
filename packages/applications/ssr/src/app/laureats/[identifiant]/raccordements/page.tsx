import { mediator } from 'mediateur';
import type { Metadata } from 'next';

import { Option } from '@potentiel-libraries/monads';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
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
import { AucunDossierDeRaccordementPage } from '@/components/pages/réseau/raccordement/détails/AucunDossierDeRaccordement.page';
import { displayDate } from '@/utils/displayDate';
import { ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';
import { mapToProjetBannerProps } from '@/utils/mapToProjetBannerProps';

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

      const projet = mapToProjetBannerProps({
        identifiantProjet,
        projet: candidature,
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

      if (listeDossiersRaccordement.dossiers.length === 0) {
        return <AucunDossierDeRaccordementPage projet={projet} />;
      }

      const props = mapToProps({
        rôleUtilisateur: utilisateur.role,
        projet,
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
  projet: ProjetBannerProps;
  identifiantProjet: string;
  gestionnaireRéseau: Option.Type<GestionnaireRéseau.ConsulterGestionnaireRéseauReadModel>;
  listeDossiersRaccordement: Raccordement.ConsulterRaccordementReadModel;
}) => DétailsRaccordementPageProps;

const mapToProps: MapToProps = ({
  rôleUtilisateur,
  projet,
  identifiantProjet,
  gestionnaireRéseau,
  listeDossiersRaccordement,
}) => ({
  projet,
  ...(!Option.isNone(gestionnaireRéseau) && {
    gestionnaireRéseau: {
      ...gestionnaireRéseau,
      identifiantGestionnaireRéseau: gestionnaireRéseau.identifiantGestionnaireRéseau.formatter(),
      aideSaisieRéférenceDossierRaccordement: {
        ...gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement,
        expressionReguliere:
          gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.expressionReguliere.formatter(),
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
        accuséRéception: dossier.demandeComplèteRaccordement.accuséRéception
          ? displayDate(dossier.demandeComplèteRaccordement.accuséRéception.formatter())
          : undefined,
        dateQualification: dossier.demandeComplèteRaccordement.dateQualification
          ? displayDate(dossier.demandeComplèteRaccordement.dateQualification.formatter())
          : undefined,
      },
      propositionTechniqueEtFinancière: {
        canEdit:
          rôleUtilisateur.estÉgaleÀ(Role.admin) ||
          rôleUtilisateur.estÉgaleÀ(Role.dgecValidateur) ||
          rôleUtilisateur.estÉgaleÀ(Role.porteur),
        dateSignature: dossier.propositionTechniqueEtFinancière
          ? displayDate(dossier.propositionTechniqueEtFinancière.dateSignature.formatter())
          : undefined,
        propositionTechniqueEtFinancièreSignée:
          dossier.propositionTechniqueEtFinancière?.propositionTechniqueEtFinancièreSignée.formatter(),
      },
      miseEnService: {
        canEdit:
          rôleUtilisateur.estÉgaleÀ(Role.admin) || rôleUtilisateur.estÉgaleÀ(Role.dgecValidateur),
        dateMiseEnService: dossier.miseEnService?.dateMiseEnService
          ? displayDate(dossier.miseEnService.dateMiseEnService.formatter())
          : undefined,
      },
    };
  }),
});
