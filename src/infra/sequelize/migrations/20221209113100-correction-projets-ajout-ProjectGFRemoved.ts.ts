import { ProjectGFRemoved } from '@modules/project'
import { QueryInterface, QueryTypes } from 'sequelize'
import { GarantiesFinancières } from '..'
import { toPersistance } from '../helpers/toPersistance'
import { models } from '../models'

module.exports = {
  async up(queryInterface: QueryInterface) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      const { EventStore } = models
      const projetsACorriger = await queryInterface.sequelize.query(
        `select "projects"."id"
from "projects"
join "eventStores" 
on cast("projects"."id" as char(36)) = cast("eventStores"."payload"->>'projectId' as char(36))
where "soumisAuxGF" = false
and "classe" = 'Classé'
and "eventStores"."type" = 'ProjectGFDueDateSet';`,
        { type: QueryTypes.SELECT, transaction }
      )

      if (!projetsACorriger.length) {
        console.log(`aucun projet trouvé`)
      } else {
        console.log(`${projetsACorriger.length} projets à corriger`)
        let projetsCorrigés = 0
        for (const projet of projetsACorriger) {
          await EventStore.create(
            toPersistance(
              new ProjectGFRemoved({
                payload: { projectId: projet['id'] },
                original: {
                  occurredAt: new Date(),
                  version: 1,
                },
              })
            ),
            { transaction }
          )

          await GarantiesFinancières.destroy({ where: { projetId: projet['id'] }, transaction })
          projetsCorrigés++
        }
        console.log(`${projetsCorrigés} projets corrigés`)
      }
      await transaction.commit()
    } catch (e) {
      console.error(e)
      await transaction.rollback()
    }
  },

  async down() {},
}
