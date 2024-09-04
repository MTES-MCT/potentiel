import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { GestionnaireRéseau, Raccordement } from '@potentiel-domain/reseau';
import { Role, Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';
import { StatutProjet } from '@potentiel-domain/common';

import {
  AucunDossierDeRaccordementPage,
  AucunDossierDeRaccordementProps,
} from '@/components/pages/réseau/raccordement/détails/AucunDossierDeRaccordement.page';
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

      const projet = await mediator.send<Candidature.ConsulterProjetQuery>({
        type: 'Candidature.Query.ConsulterProjet',
        data: {
          identifiantProjet,
        },
      });

      if (Option.isNone(projet)) {
        return notFound();
      }

      const raccordement = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
        type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

      if (Option.isNone(raccordement)) {
        const canEditGestionnaireRéseau =
          utilisateur.role.estÉgaleÀ(Role.admin) ||
          utilisateur.role.estÉgaleÀ(Role.dgecValidateur) ||
          utilisateur.role.estÉgaleÀ(Role.porteur);

        const grd = {
          identifiantGestionnaireRéseau:
            GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu.formatter(),
          raisonSociale: '',
          aideSaisieRéférenceDossierRaccordement: {
            format: '',
            légende: '',
            expressionReguliere: '',
          },
          canEdit: canEditGestionnaireRéseau,
        };
        return (
          <AucunDossierDeRaccordementPage
            identifiantProjet={identifiantProjet}
            gestionnaireRéseau={grd}
            actions={mapToAucunDossierActions({
              utilisateur,
              statutProjet: projet.statut,
            })}
          />
        );
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

      return raccordement.dossiers.length === 0 ? (
        <AucunDossierDeRaccordementPage
          identifiantProjet={identifiantProjet}
          gestionnaireRéseau={props.gestionnaireRéseau}
          actions={mapToAucunDossierActions({
            utilisateur,
            statutProjet: projet.statut,
          })}
        />
      ) : (
        <DétailsRaccordementPage {...props} />
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

type MapToAucunDossierActionsProps = {
  utilisateur: Utilisateur.ValueType;
  statutProjet: StatutProjet.RawType;
};
const mapToAucunDossierActions = ({ utilisateur, statutProjet }: MapToAucunDossierActionsProps) => {
  const actions: AucunDossierDeRaccordementProps['actions'] = [];

  if (
    utilisateur.role.aLaPermission(
      'réseau.raccordement.proposition-technique-et-financière.transmettre',
    ) &&
    !StatutProjet.convertirEnValueType(statutProjet).estÉgaleÀ(StatutProjet.abandonné)
  ) {
    actions.push('transmettre-demande-complete-raccordement');
  }

  return [];
};
