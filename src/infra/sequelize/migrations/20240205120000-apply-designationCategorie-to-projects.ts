'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // périodes avec volume réservé
      const periodesProjetsÀModifier = [
        { appelOffreId: 'PPE2 - Bâtiment', periodeId: '1' },
        { appelOffreId: 'PPE2 - Bâtiment', periodeId: '2' },
        { appelOffreId: 'PPE2 - Bâtiment', periodeId: '3' },
        { appelOffreId: 'PPE2 - Bâtiment', periodeId: '4' },
        { appelOffreId: 'PPE2 - Bâtiment', periodeId: '5' },
        { appelOffreId: 'PPE2 - Sol', periodeId: '1' },
        { appelOffreId: 'PPE2 - Sol', periodeId: '2' },
        { appelOffreId: 'PPE2 - Sol', periodeId: '3' },
        { appelOffreId: 'PPE2 - Sol', periodeId: '4' },
      ];

      for (const { appelOffreId, periodeId } of periodesProjetsÀModifier) {
        const projets = await queryInterface.sequelize.query(
          `
          SELECT * 
          FROM projects 
          WHERE "appelOffreId" = ?
          AND "periodeId" = ?
        `,
          {
            type: queryInterface.sequelize.QueryTypes.SELECT,
            replacements: [appelOffreId, periodeId],
            transaction,
          },
        );

        console.log(`${projets.length} projets à mettre à jour pour ${appelOffreId} P${periodeId}`);

        if (projets.length > 0) {
          const aoPeriodes = await queryInterface.sequelize.query(
            `
          SELECT value ->> 'periodes' as "periodes"
          FROM domain_views.projection p 
          WHERE key = 'appel-offre' || '|' || ?;
        `,
            {
              type: queryInterface.sequelize.QueryTypes.SELECT,
              replacements: [appelOffreId],
              transaction,
            },
          );

          const periodeDetails = JSON.parse(aoPeriodes[0].periodes).find(
            (periode) => periode.id === periodeId,
          );

          const { puissanceMax, noteThreshold } = periodeDetails.noteThreshold.volumeReserve;

          for (const projet of projets) {
            const désignationCatégorie =
              projet.puissance <= puissanceMax && projet.note >= noteThreshold
                ? 'volume-réservé'
                : 'hors-volume-réservé';

            // Mise à jour des projets
            await queryInterface.sequelize.query(
              `
              UPDATE "projects" 
              SET "désignationCatégorie" = ? 
              WHERE id = ?
              `,
              {
                type: queryInterface.sequelize.UPDATE,
                replacements: [désignationCatégorie, projet.id],
                transaction,
              },
            );

            // Mise à jour events ProjectImported
            const event = await queryInterface.sequelize.query(
              `
              SELECT *
              FROM "eventStores" 
              WHERE type = 'ProjectImported' 
              AND payload ->> 'projectId' = ?
              `,
              {
                type: queryInterface.sequelize.SELECT,
                replacements: [projet.id],
                transaction,
              },
            );
            const { payload, id } = event[0][0];

            payload.data.désignationCatégorie = désignationCatégorie;

            await queryInterface.sequelize.query(
              `
              UPDATE "eventStores" 
              SET payload = ?
              WHERE id = ?
              `,
              {
                type: queryInterface.sequelize.UPDATE,
                replacements: [JSON.stringify(payload), id],
                transaction,
              },
            );
          }
        }
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {},
};
