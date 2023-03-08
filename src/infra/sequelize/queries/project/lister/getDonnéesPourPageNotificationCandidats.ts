import { Project } from '@entities';
import { GetDonnéesPourPageNotificationCandidats } from '@modules/notificationCandidats/queries';
import { Project as ProjectModel } from '@infra/sequelize/projectionsNext';
import { listerProjetsNonNotifiés } from './requêtes/listerProjetsNonNotifiés';

export const getDonnéesPourPageNotificationCandidats: GetDonnéesPourPageNotificationCandidats =
  async ({ pagination, appelOffreId, periodeId, recherche, classement }) => {
    const getProjetsNonNotifiés = () =>
      ProjectModel.findAll({
        where: { notifiedOn: 0 },
        attributes: ['appelOffreId', 'periodeId'],
      });

    const getListeAOs = (
      projets: Array<{
        appelOffreId: Project['appelOffreId'];
        periodeId: Project['periodeId'];
      }>,
    ): Array<Project['appelOffreId']> =>
      projets.reduce(
        (acc, projet) =>
          acc.some((element) => element === projet.appelOffreId)
            ? acc
            : [...acc, projet.appelOffreId],
        [],
      );

    const getListePériodes = ({
      projets,
      appelOffreId,
    }: {
      projets: Array<{
        appelOffreId: Project['appelOffreId'];
        periodeId: Project['periodeId'];
      }>;
      appelOffreId: Project['appelOffreId'];
    }): Array<Project['periodeId']> =>
      projets.reduce(
        (acc, projet) =>
          projet.appelOffreId === appelOffreId &&
          !acc.some((element) => element === projet.periodeId)
            ? [...acc, projet.periodeId]
            : acc,
        [],
      );

    const projetsNonNotifiés = await getProjetsNonNotifiés();

    if (projetsNonNotifiés.length === 0) {
      return null;
    }

    const listeAOs = getListeAOs(projetsNonNotifiés);
    const AOSélectionné = appelOffreId ?? listeAOs[0];
    const listePériodes = getListePériodes({
      projets: projetsNonNotifiés,
      appelOffreId: AOSélectionné,
    });
    const périodeSélectionnée = periodeId ?? listePériodes[0];

    const projetsPériodeSélectionnée = await listerProjetsNonNotifiés({
      pagination,
      filtres: {
        recherche,
        classement,
        appelOffre: {
          appelOffreId: AOSélectionné,
          periodeId: périodeSélectionnée,
        },
      },
    });

    if (projetsPériodeSélectionnée.itemCount === 0) {
      return null;
    }

    return {
      listeAOs,
      AOSélectionné,
      listePériodes,
      périodeSélectionnée,
      projetsPériodeSélectionnée,
    };
  };
