import { mediator } from 'mediateur';
import * as yup from 'yup';
import { getProjectEvents } from '../../config';
import { getProjectDataForProjectPage } from '../../config/queries.config';
import { shouldUserAccessProject } from '../../config/useCases.config';
import { Project } from '../../infra/sequelize';
import { PermissionConsulterProjet, ProjectDataForProjectPage } from '../../modules/project';
import { UtilisateurReadModel } from '../../modules/utilisateur/récupérer/UtilisateurReadModel';
import routes from '../../routes';
import { ProjectDetailsPage } from '../../views';
import { AlerteRaccordement } from '../../views/pages/projectDetailsPage';
import {
  miseAJourStatistiquesUtilisation,
  notFoundResponse,
  unauthorizedResponse,
  vérifierPermissionUtilisateur,
} from '../helpers';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { v1Router } from '../v1Router';

import { Abandon, Achèvement, GarantiesFinancières } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Raccordement } from '@potentiel-domain/reseau';
import { AchèvementRéelDTO } from '../../modules/frise';
import { Option } from '@potentiel-libraries/monads';
import { User } from '../../entities';
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

      const garantiesFinancières = projet.appelOffre.isSoumisAuxGF
        ? await getGarantiesFinancières(identifiantProjetValueType)
        : undefined;

      const attestationConformité = await getAttestationConformité(
        identifiantProjetValueType,
        user,
      );

      return response.send(
        ProjectDetailsPage({
          request,
          project: {
            ...projet,
            garantiesFinancières,
          },
          projectEventList: {
            ...rawProjectEventList.value,
            events: attestationConformité
              ? rawProjectEventList.value.events.concat(attestationConformité)
              : rawProjectEventList.value.events,
          },
          alertesRaccordement,
          abandon,
          hasAttestationConformité: !!attestationConformité,
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
    const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

    if (Option.isNone(abandon)) {
      return;
    }

    const { statut } = abandon;

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

const getAttestationConformité = async (
  identifiantProjet: IdentifiantProjet.ValueType,
  user: User,
): Promise<AchèvementRéelDTO | undefined> => {
  const attestationConformité = await mediator.send<Achèvement.ConsulterAttestationConformitéQuery>(
    {
      type: 'Lauréat.Achèvement.AttestationConformité.Query.ConsulterAttestationConformité',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    },
  );

  return Option.isSome(attestationConformité)
    ? {
        type: 'achevement-reel',
        date: attestationConformité.dateTransmissionAuCocontractant.date.getTime(),
        attestation: attestationConformité.attestation.formatter(),
        preuveTransmissionAuCocontractant:
          attestationConformité.preuveTransmissionAuCocontractant.formatter(),
        identifiantProjet: identifiantProjet.formatter(),
        permissionModifier: ['admin', 'dreal', 'dgec-validateur'].includes(user.role),
      }
    : undefined;
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

  const alertes: Array<AlerteRaccordement> = [];
  const dossiersRaccordement = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
    type: 'Réseau.Raccordement.Query.ConsulterRaccordement',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });

  if(Option.isSome(dossiersRaccordement)) {
    if (
      CDC2022Choisi &&
      dossiersRaccordement.dossiers[0].référence.estÉgaleÀ(
        Raccordement.RéférenceDossierRaccordement.référenceNonTransmise,
      )
    ) {
      alertes.push('référenceDossierManquantePourDélaiCDC2022');
    }

    if (!dossiersRaccordement.dossiers[0].demandeComplèteRaccordement.accuséRéception) {
      alertes.push('demandeComplèteRaccordementManquante');
    }
  } else {
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
  const garantiesFinancièresActuelles =
    await mediator.send<GarantiesFinancières.ConsulterGarantiesFinancièresQuery>({
      type: 'Lauréat.GarantiesFinancières.Query.ConsulterGarantiesFinancières',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

  const dépôtEnCoursGarantiesFinancières =
    await mediator.send<GarantiesFinancières.ConsulterDépôtEnCoursGarantiesFinancièresQuery>({
      type: 'Lauréat.GarantiesFinancières.Query.ConsulterDépôtEnCoursGarantiesFinancières',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

  const projetAvecGarantiesFinancièresEnAttente =
    await mediator.send<GarantiesFinancières.ConsulterProjetAvecGarantiesFinancièresEnAttenteQuery>(
      {
        type: 'Lauréat.GarantiesFinancières.Query.ConsulterProjetAvecGarantiesFinancièresEnAttente',
        data: { identifiantProjetValue: identifiantProjet.formatter() },
      },
    );

  const actuelles = Option.isSome(garantiesFinancièresActuelles)
    ? {
        type: garantiesFinancièresActuelles.garantiesFinancières.type.type,
        dateÉchéance:
          garantiesFinancièresActuelles.garantiesFinancières.dateÉchéance &&
          garantiesFinancièresActuelles.garantiesFinancières.dateÉchéance.formatter(),
        dateConstitution:
          garantiesFinancièresActuelles.garantiesFinancières.dateConstitution &&
          garantiesFinancièresActuelles.garantiesFinancières.dateConstitution.formatter(),
      }
    : undefined;

  const dépôtÀTraiter = Option.isSome(dépôtEnCoursGarantiesFinancières)
    ? {
        type: dépôtEnCoursGarantiesFinancières.dépôt.type.type,
        dateÉchéance:
          dépôtEnCoursGarantiesFinancières.dépôt.dateÉchéance &&
          dépôtEnCoursGarantiesFinancières.dépôt.dateÉchéance.formatter(),
        dateConstitution: dépôtEnCoursGarantiesFinancières.dépôt.dateConstitution.formatter(),
      }
    : undefined;

  const garantiesFinancièresEnAttente = Option.isSome(projetAvecGarantiesFinancièresEnAttente)
    ? { motif: projetAvecGarantiesFinancièresEnAttente.motif.motif }
    : undefined;

  return {
    actuelles,
    dépôtÀTraiter,
    garantiesFinancièresEnAttente,
  };
};
