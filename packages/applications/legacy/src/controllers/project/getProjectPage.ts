import { getProjectEvents } from '../../config';
import { getProjectDataForProjectPage } from '../../config/queries.config';
import { shouldUserAccessProject } from '../../config/useCases.config';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import { ProjectDetailsPage } from '../../views';
import {
  notFoundResponse,
  unauthorizedResponse,
  miseAJourStatistiquesUtilisation,
  vérifierPermissionUtilisateur,
} from '../helpers';
import routes from '../../routes';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { PermissionConsulterProjet, ProjectDataForProjectPage } from '../../modules/project';
import { mediator } from 'mediateur';
import { AlerteRaccordement } from '../../views/pages/projectDetailsPage';
import { UtilisateurReadModel } from '../../modules/utilisateur/récupérer/UtilisateurReadModel';
import { Project } from '../../infra/sequelize';

import { Abandon, GarantiesFinancières } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/reseau';
const schema = yup.object({
  params: yup.object({ projectId: yup.string().required() }),
});

export const estUnLegacyIdentifiantProjet = (value: string): value is IdentifiantProjet.RawType => {
  const [appelOffre, période, famille, numéroCRE] = value.split('#');

  return (
    typeof appelOffre === 'string' &&
    typeof numéroCRE === 'string' &&
    typeof période === 'string' &&
    typeof famille === 'string'
  );
};

const getLegacyIdentifiantProjet = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);
  const projetLegacy = await Project.findOne({
    where: {
      appelOffreId: identifiantProjetValueType.appelOffre,
      periodeId: identifiantProjetValueType.période,
      familleId: identifiantProjetValueType.famille ?? '',
      numeroCRE: identifiantProjetValueType.numéroCRE,
    },
    attributes: ['id'],
  });

  return projetLegacy?.id;
};

v1Router.get(
  routes.PROJECT_DETAILS(),
  vérifierPermissionUtilisateur(PermissionConsulterProjet),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const { user } = request;

      const projectId = request.params.projectId;

      if (!projectId) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      if (estUnLegacyIdentifiantProjet(projectId)) {
        const legacyId = await getLegacyIdentifiantProjet(projectId);

        if (!legacyId) {
          return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
        }

        return response.redirect(routes.PROJECT_DETAILS(legacyId));
      }

      const userHasRightsToProject = await shouldUserAccessProject.check({
        user,
        projectId,
      });

      if (!userHasRightsToProject) {
        return unauthorizedResponse({
          request,
          response,
          customMessage: `Votre compte ne vous permet pas d'accéder à ce projet.`,
        });
      }

      const rawProjet = await getProjectDataForProjectPage({ projectId, user });

      if (rawProjet.isErr()) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const projet = rawProjet.value;

      const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(
        `${projet.appelOffreId}#${projet.periodeId}#${projet.familleId}#${projet.numeroCRE}`,
      );
      const abandon = await getAbandon(identifiantProjetValueType);

      const alertesRaccordement =
        !abandon || abandon.statut === 'rejeté'
          ? await getAlertesRaccordement({
              userRole: user.role,
              identifiantProjet: identifiantProjetValueType,
              CDC2022Choisi:
                projet.cahierDesChargesActuel.type === 'modifié' &&
                projet.cahierDesChargesActuel.paruLe === '30/08/2022',
              projet: {
                isClasse: projet.isClasse,
                isAbandonned: projet.isAbandoned,
              },
            })
          : undefined;

      const rawProjectEventList = await getProjectEvents({ projectId: projet.id, user });

      if (rawProjectEventList.isErr()) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      miseAJourStatistiquesUtilisation({
        type: 'projetConsulté',
        données: {
          utilisateur: { role: request.user.role },
          projet: {
            appelOffreId: projet.appelOffreId,
            periodeId: projet.periodeId,
            ...(projet.familleId && { familleId: projet.familleId }),
            numéroCRE: projet.numeroCRE,
          },
        },
      });

      let garantiesFinancières: ProjectDataForProjectPage['garantiesFinancières'] | undefined =
        undefined;

      if (projet.appelOffre.isSoumisAuxGF) {
        garantiesFinancières = await getGarantiesFinancières(identifiantProjetValueType);
      }

      return response.send(
        ProjectDetailsPage({
          request,
          project: { ...projet, ...(garantiesFinancières && { garantiesFinancières }) },
          projectEventList: rawProjectEventList.value,
          alertesRaccordement,
          ...(abandon && { abandon }),
        }),
      );
    },
  ),
);

type AbandonEnInstructionProps = { statut: string } | undefined;
const getAbandon = async (
  identifiantProjet: IdentifiantProjet.ValueType,
): Promise<AbandonEnInstructionProps> => {
  try {
    const abandonDétecté = await mediator.send<Abandon.DétecterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.DétecterAbandon',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

    if (!abandonDétecté) {
      return;
    }

    const { statut } = await mediator.send<Abandon.ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

    switch (statut.statut) {
      case 'demandé':
      case 'confirmé':
      case 'accordé':
      case 'rejeté':
        return { statut: statut.statut };
      case 'confirmation-demandée':
        return { statut: 'à confirmer' };
      default:
        return;
    }
  } catch (error) {
    return;
  }
};

const getAlertesRaccordement = async ({
  userRole,
  identifiantProjet,
  CDC2022Choisi,
  projet,
}: {
  userRole: UtilisateurReadModel['role'];
  identifiantProjet: IdentifiantProjet.ValueType;
  CDC2022Choisi: boolean;
  projet: {
    isClasse: boolean;
    isAbandonned: boolean;
  };
}) => {
  if (userRole !== 'porteur-projet' || !projet.isClasse || projet.isAbandonned) {
    return;
  }

  let alertes: Array<AlerteRaccordement> = [];
  let dossiersRaccordement: Raccordement.ConsulterRaccordementReadModel;

  try {
    // @TODO : utilisation d'un try/catch temporaire
    // mais il faudrait revoir le système de gestion des alertes sur le projet
    // et à discuter avec le métier : qu'est-ce qui est une "alerte" ou une "tâche" en ce qui concerne les raccordements
    dossiersRaccordement = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
      type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

    if (
      CDC2022Choisi &&
      dossiersRaccordement.dossiers[0].référence.formatter() === 'Référence non transmise'
    ) {
      alertes.push('référenceDossierManquantePourDélaiCDC2022');
    }

    if (!dossiersRaccordement.dossiers[0].demandeComplèteRaccordement.accuséRéception) {
      alertes.push('demandeComplèteRaccordementManquante');
    }
  } catch (error) {
    alertes.push('demandeComplèteRaccordementManquante');
    if (CDC2022Choisi) {
      alertes.push('référenceDossierManquantePourDélaiCDC2022');
    }
  }

  return alertes.length > 0 ? alertes : undefined;
};

const getGarantiesFinancières = async (
  identifiantProjet: IdentifiantProjet.ValueType,
): Promise<ProjectDataForProjectPage['garantiesFinancières']> => {
  let garantiesFinancières: GarantiesFinancières.ConsulterGarantiesFinancièresReadModel;
  try {
    garantiesFinancières =
      await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
        data: { identifiantProjetValue: identifiantProjet.formatter() },
      });

    const dépôtEnCours = garantiesFinancières.dépôts.find((dépôt) => dépôt.statut.estEnCours());

    if (!garantiesFinancières || (!garantiesFinancières.actuelles && !dépôtEnCours)) {
      return { garantiesFinancièresEnAttente: true };
    }

    return {
      ...(garantiesFinancières.actuelles && {
        actuelles: {
          type: garantiesFinancières.actuelles.type.type,
          dateÉchéance:
            garantiesFinancières.actuelles.dateÉchéance &&
            garantiesFinancières.actuelles.dateÉchéance.formatter(),
          dateConstitution:
            garantiesFinancières.actuelles.dateConstitution &&
            garantiesFinancières.actuelles.dateConstitution.formatter(),
        },
      }),
      ...(dépôtEnCours && {
        dépôtÀTraiter: {
          type: dépôtEnCours.type.type,
          dateÉchéance: dépôtEnCours.dateÉchéance && dépôtEnCours.dateÉchéance.formatter(),
          dateConstitution: dépôtEnCours.dateConstitution.formatter(),
        },
      }),
    };
  } catch (error) {
    return { garantiesFinancièresEnAttente: true };
  }
};
