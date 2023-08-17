import routes from '../../routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { notFoundResponse, unauthorizedResponse, vérifierPermissionUtilisateur } from '../helpers';
import {
  ConsulterDépôtGarantiesFinancièresQuery,
  ConsulterProjetQuery,
} from '@potentiel/domain-views';
import { ModifierDépôtGarantiesFinancièresPage } from '../../views';
import { mediator } from 'mediateur';
import {
  convertirEnIdentifiantProjet,
  estUnRawIdentifiantProjet,
  PermissionDéposerGarantiesFinancières,
} from '@potentiel/domain';
import { isNone, isSome } from '@potentiel/monads';
import { Project, UserProjects } from '../../infra/sequelize/projectionsNext';
import { addQueryParams } from '../../helpers/addQueryParams';
import { getProjectAppelOffre } from '../../config';

const schema = yup.object({
  params: yup.object({
    identifiantProjet: yup.string().required(),
  }),
});

v1Router.get(
  routes.GET_MODIFIER_DEPOT_GARANTIES_FINANCIERES_PAGE(),
  vérifierPermissionUtilisateur(PermissionDéposerGarantiesFinancières),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) =>
        notFoundResponse({ request, response, ressourceTitle: 'Projet' }),
    },
    async (request, response) => {
      const {
        user,
        params: { identifiantProjet },
        query: { error },
      } = request;

      if (!estUnRawIdentifiantProjet(identifiantProjet)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);

      const projet = await mediator.send<ConsulterProjetQuery>({
        type: 'CONSULTER_PROJET',
        data: {
          identifiantProjet: identifiantProjetValueType,
        },
      });

      if (isNone(projet)) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Projet',
        });
      }

      const projetWithId = await Project.findOne({
        where: {
          appelOffreId: identifiantProjetValueType.appelOffre,
          periodeId: identifiantProjetValueType.période,
          familleId: isSome(identifiantProjetValueType.famille)
            ? identifiantProjetValueType.famille
            : '',
          numeroCRE: identifiantProjetValueType.numéroCRE,
        },
        attributes: ['id', 'appelOffreId', 'periodeId', 'familleId'],
      });

      if (!projetWithId) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Projet',
        });
      }

      const appelOffre = getProjectAppelOffre({
        appelOffreId: projetWithId.appelOffreId,
        periodeId: projetWithId.periodeId,
        familleId: projetWithId.familleId,
      });
      if (appelOffre && !appelOffre.isSoumisAuxGF) {
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(identifiantProjet), {
            error: `L'appel d'offres de votre projet n'est pas soumis aux garanties financières.`,
          }),
        );
      }

      if (user.role === 'porteur-projet') {
        const porteurAAccèsAuProjet = !!(await UserProjects.findOne({
          where: { projectId: projetWithId.id, userId: user.id },
        }));

        if (!porteurAAccèsAuProjet) {
          return unauthorizedResponse({
            request,
            response,
            customMessage: `Vous n'avez pas accès à ce projet.`,
          });
        }
      }

      const dépôt = await mediator.send<ConsulterDépôtGarantiesFinancièresQuery>({
        type: 'CONSULTER_DÉPÔT_GARANTIES_FINANCIÈRES',
        data: { identifiantProjet },
      });

      return response.send(
        ModifierDépôtGarantiesFinancièresPage({
          user,
          projet,
          error: error as string,
          ...(isSome(dépôt) && { dépôt }),
        }),
      );
    },
  ),
);
