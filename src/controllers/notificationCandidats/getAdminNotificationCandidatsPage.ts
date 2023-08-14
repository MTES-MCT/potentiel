import asyncHandler from '../helpers/asyncHandler';
import routes from '../../routes';
import { v1Router } from '../v1Router';
import { AdminNotificationCandidatsPage } from '../../views';
import { getCurrentUrl, getPagination, vérifierPermissionUtilisateur } from '../helpers';
import { PermissionListerProjetsÀNotifier } from '../../modules/notificationCandidats';
import { getDonnéesPourPageNotificationCandidats } from '../../config/queries.config';

v1Router.get(
  routes.GET_NOTIFIER_CANDIDATS(),
  vérifierPermissionUtilisateur(PermissionListerProjetsÀNotifier),
  asyncHandler(async (request, response) => {
    let {
      query: { appelOffreId, periodeId, recherche, classement },
    } = request as any;

    const pagination = getPagination(request);

    if (!appelOffreId) {
      // Reset the periodId
      periodeId = undefined;
    }

    const données = await getDonnéesPourPageNotificationCandidats({
      appelOffreId,
      periodeId,
      pagination,
      recherche,
      classement,
    });

    if (données === null) {
      return response.send(
        AdminNotificationCandidatsPage({
          request,
          currentUrl: getCurrentUrl(request),
        }),
      );
    }

    const {
      projetsPériodeSélectionnée,
      AOSélectionné,
      périodeSélectionnée,
      listeAOs,
      listePériodes,
    } = données;

    response.send(
      AdminNotificationCandidatsPage({
        request,
        données: {
          projetsPériodeSélectionnée,
          AOSélectionné,
          périodeSélectionnée,
          listeAOs,
          listePériodes,
        },
        currentUrl: getCurrentUrl(request),
      }),
    );
  }),
);
