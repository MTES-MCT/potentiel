import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { GestionnaireRéseau, Raccordement } from '@potentiel-domain/reseau';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';

import {
  DétailsRaccordementPage,
  DétailsRaccordementPageProps,
} from '@/components/pages/réseau/raccordement/détails/DétailsRaccordement.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { récupérerProjet, vérifierQueLeProjetEstClassé } from '@/app/_helpers';

type PageProps = IdentifiantParameter;

export const metadata: Metadata = {
  title: 'Raccordement du projet - Potentiel',
  description: 'Raccordement du projet',
};

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

      const projet = await récupérerProjet(identifiantProjet);

      await vérifierQueLeProjetEstClassé({
        statut: projet.statut,
        message: "Vous ne pouvez pas consulter le raccordement d'un projet éliminé ou abandonné",
      });

      const raccordement = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

      if (Option.isNone(raccordement) || raccordement.dossiers.length === 0) {
        redirect(Routes.Raccordement.transmettreDemandeComplèteRaccordement(identifiantProjet));
      }

      const gestionnaireRéseau =
        await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>({
          type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
          data: {
            identifiantGestionnaireRéseau:
              raccordement.identifiantGestionnaireRéseau?.formatter() || '',
          },
        });

      const props = mapToProps({
        rôleUtilisateur: utilisateur.role,
        identifiantProjet,
        gestionnaireRéseau,
        raccordement,
      });

      return (
        <DétailsRaccordementPage
          identifiantProjet={props.identifiantProjet}
          gestionnaireRéseau={props.gestionnaireRéseau}
          dossiers={props.dossiers}
        />
      );
    }),
  );
}

type MapToProps = (args: {
  rôleUtilisateur: Role.ValueType;
  identifiantProjet: string;
  gestionnaireRéseau: Option.Type<GestionnaireRéseau.ConsulterGestionnaireRéseauReadModel>;
  raccordement: Raccordement.ConsulterRaccordementReadModel;
}) => DétailsRaccordementPageProps;

const mapToProps: MapToProps = ({
  rôleUtilisateur,
  identifiantProjet,
  gestionnaireRéseau,
  raccordement,
}) => {
  const aUneDateDeMiseEnService = raccordement.dossiers.some((dossier) => dossier.miseEnService);
  const canEditGestionnaireRéseau =
    rôleUtilisateur.estÉgaleÀ(Role.admin) ||
    rôleUtilisateur.estÉgaleÀ(Role.dgecValidateur) ||
    (!aUneDateDeMiseEnService &&
      (rôleUtilisateur.estÉgaleÀ(Role.porteur) || rôleUtilisateur.estÉgaleÀ(Role.dreal)));

  return {
    identifiantProjet,
    gestionnaireRéseau: Option.isNone(gestionnaireRéseau)
      ? undefined
      : {
          ...gestionnaireRéseau,
          identifiantGestionnaireRéseau:
            gestionnaireRéseau.identifiantGestionnaireRéseau.formatter(),
          aideSaisieRéférenceDossierRaccordement: {
            ...gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement,
            expressionReguliere:
              gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.expressionReguliere.formatter(),
          },
          contactEmail: Option.isNone(gestionnaireRéseau.contactEmail)
            ? undefined
            : gestionnaireRéseau.contactEmail.email,
          canEdit: canEditGestionnaireRéseau,
        },
    dossiers: mapToPropsDossiers({ raccordement, rôleUtilisateur, identifiantProjet }),
  };
};

type MapToPropsDossiers = {
  raccordement: Raccordement.ConsulterRaccordementReadModel;
  rôleUtilisateur: Role.ValueType;
  identifiantProjet: string;
};
const mapToPropsDossiers = ({
  raccordement,
  identifiantProjet,
  rôleUtilisateur,
}: MapToPropsDossiers) =>
  raccordement.dossiers.map((dossier) => {
    const canEditDemandeComplèteRaccordement =
      rôleUtilisateur.estÉgaleÀ(Role.admin) ||
      rôleUtilisateur.estÉgaleÀ(Role.dgecValidateur) ||
      ((rôleUtilisateur.estÉgaleÀ(Role.porteur) || rôleUtilisateur.estÉgaleÀ(Role.dreal)) &&
        !dossier.miseEnService?.dateMiseEnService);

    const canEditPropositionTechniqueEtFinancière =
      rôleUtilisateur.estÉgaleÀ(Role.admin) ||
      rôleUtilisateur.estÉgaleÀ(Role.dgecValidateur) ||
      rôleUtilisateur.estÉgaleÀ(Role.dreal) ||
      rôleUtilisateur.estÉgaleÀ(Role.porteur);

    const canTransmettreDateMiseEnService =
      rôleUtilisateur.estÉgaleÀ(Role.admin) || rôleUtilisateur.estÉgaleÀ(Role.dgecValidateur);

    const canDeleteDossier =
      rôleUtilisateur.aLaPermission('réseau.raccordement.dossier.supprimer') &&
      !dossier.miseEnService;

    return {
      identifiantProjet,
      référence: dossier.référence.formatter(),
      demandeComplèteRaccordement: {
        canEdit: canEditDemandeComplèteRaccordement,
        accuséRéception: dossier.demandeComplèteRaccordement.accuséRéception?.formatter(),
        dateQualification: dossier.demandeComplèteRaccordement.dateQualification?.formatter(),
      },
      propositionTechniqueEtFinancière: {
        canEdit: canEditPropositionTechniqueEtFinancière,
        dateSignature: dossier.propositionTechniqueEtFinancière?.dateSignature.formatter(),
        propositionTechniqueEtFinancièreSignée:
          dossier.propositionTechniqueEtFinancière?.propositionTechniqueEtFinancièreSignée.formatter(),
      },
      miseEnService: {
        canEdit: canTransmettreDateMiseEnService,
        dateMiseEnService: dossier.miseEnService?.dateMiseEnService?.formatter(),
      },
      canDeleteDossier,
    };
  });
