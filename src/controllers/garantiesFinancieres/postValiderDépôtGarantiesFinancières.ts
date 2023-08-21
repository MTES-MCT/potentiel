import routes from '../../routes';
import { v1Router } from '../v1Router';
import * as yup from 'yup';
import safeAsyncHandler from '../helpers/safeAsyncHandler';
import { errorResponse, notFoundResponse, vérifierPermissionUtilisateur } from '../helpers';
import { mediator } from 'mediateur';
import {
  convertirEnIdentifiantProjet,
  estUnRawIdentifiantProjet,
  PermissionValiderDépôtGarantiesFinancières,
} from '@potentiel/domain';
import { isSome } from '@potentiel/monads';
import { Project } from '../../infra/sequelize/projectionsNext';
import { DomainError } from '@potentiel/core-domain';
import { addQueryParams } from '../../helpers/addQueryParams';
import { getProjectAppelOffre } from '../../config';
import { GarantiesFinancièresUseCase } from '@potentiel/domain/dist/garantiesFinancières/garantiesFinancières.usecase';

const schema = yup.object({
  params: yup.object({
    identifiantProjet: yup.string().required(),
  }),
});

v1Router.post(
  routes.POST_VALIDER_DEPOT_GARANTIES_FINANCIERES(),
  vérifierPermissionUtilisateur(PermissionValiderDépôtGarantiesFinancières),
  safeAsyncHandler(
    {
      schema,
      onError: ({ request, response }) => {
        const identifiant = request.params.identifiantProjet;
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(identifiant), {
            error: `Le dépôt de garanties financières n'a pas pu être validé. Veuillez contacter un administrateur si le problème persiste.`,
          }),
        );
      },
    },
    async (request, response) => {
      const {
        user,
        params: { identifiantProjet },
      } = request;

      if (!estUnRawIdentifiantProjet(identifiantProjet)) {
        return notFoundResponse({ request, response, ressourceTitle: 'Projet' });
      }

      const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);

      const projet = await Project.findOne({
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

      if (!projet) {
        return notFoundResponse({
          request,
          response,
          ressourceTitle: 'Projet',
        });
      }

      const appelOffre = getProjectAppelOffre({
        appelOffreId: projet.appelOffreId,
        periodeId: projet.periodeId,
        familleId: projet.familleId,
      });
      if (appelOffre && !appelOffre.isSoumisAuxGF) {
        response.redirect(
          addQueryParams(routes.PROJECT_DETAILS(identifiantProjet), {
            error: `L'appel d'offres n'est pas soumis aux garanties financières.`,
          }),
        );
      }

      if (user.role === 'dreal') {
        //TO DO : vérifier région user
      }

      try {
        await mediator.send<GarantiesFinancièresUseCase>({
          type: 'VALIDER_DÉPÔT_GARANTIES_FINANCIÈRES_USE_CASE',
          data: {
            identifiantProjet: identifiantProjetValueType,
          },
        });

        return response.redirect(
          routes.SUCCESS_OR_ERROR_PAGE({
            success: 'Le dépôt de garanties financières a bien été validé',
            redirectUrl: routes.PROJECT_DETAILS(identifiantProjet),
            redirectTitle: 'Retourner sur la page du projet',
          }),
        );
      } catch (error) {
        if (error instanceof DomainError) {
          return response.redirect(
            addQueryParams(routes.PROJECT_DETAILS(identifiantProjet), {
              error: error.message,
            }),
          );
        }

        return errorResponse({ request, response });
      }
    },
  ),
);
